package com.NullPointers.Atlas.Service;

import com.NullPointers.Atlas.DAO.TaskDao;
import com.NullPointers.Atlas.DTO.TaskSchedulerResponse;
import com.NullPointers.Atlas.Entity.Task;
import lombok.Getter;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

public class TaskScheduler {
    private final TaskDao taskRepo;
    private static final int dailyTimeLimit = 8 * 60; // 8 hours
    private static final int minValue = 60; // minimum time for a task = 60 min
    private static final int quantum = 60; // every task duration is multiply of quantum, 15 minutes
    private final TreeMap<LocalDate, List<Task>> calender;
//    private static String idAsFlag;

    public TaskScheduler(TaskDao taskRepo, List<Task> taskCalender) {
        this.taskRepo = taskRepo;
        this.calender = taskCalender.stream()
                .collect(Collectors.groupingBy(
                        Task::getStartDate,
                        TreeMap::new,
                        Collectors.toList()));
    }

    /**
     * input: task;
     * default values: scheduling start from tomorrow, isPartition = true
     */
    public TaskSchedulerResponse taskScheduler(Task task) {
//        idAsFlag = task.getTaskId();
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        return partitionAndSchedule(task, tomorrow, true);
    }

    /**
     * input: task, schedulingStartFrom;
     * default value: isPartition = true
     */
    public TaskSchedulerResponse taskScheduler(Task task, LocalDate schedulingStartFrom) {
//        idAsFlag = task.getTaskId();
        if(scheduler(task, schedulingStartFrom)){
            return new TaskSchedulerResponse(null, true, 201, "success");
        } else return new TaskSchedulerResponse(null, false, 404, "failed");
    }

    /**
     * input: task, isPartition;
     * default value: scheduling start from tomorrow
     */
    public TaskSchedulerResponse taskScheduler(Task task, boolean isPartition) {
//        idAsFlag = task.getTaskId();
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        return partitionAndSchedule(task, tomorrow, isPartition);
    }

    /**
     * input: task, schedulingStartFrom, isPartition;
     */
    public TaskSchedulerResponse taskScheduler(Task task, LocalDate schedulingStartFrom, boolean isPartition) {
//        idAsFlag = task.getTaskId();
        return partitionAndSchedule(task, schedulingStartFrom, isPartition);
    }

    private boolean saveInDB() {
        List<Task> tasks = calender.values().stream()
                .flatMap(List::stream)
                .map(eachTask -> {
                    Task.TaskBuilder builder = Task.builder()
                            .parentId(eachTask.getParentId())
                            .taskId(eachTask.getTaskId())
                            .rootId(eachTask.getRootId())
                            .parentLabel(eachTask.getParentLabel())
                            .authorId(eachTask.getAuthorId())
                            .label(eachTask.getLabel())
                            .startDate(eachTask.getStartDate())
                            .assignedDate(eachTask.getAssignedDate())
                            .endDate(eachTask.getEndDate())
                            .remMin(eachTask.getRemMin())
                            .status(eachTask.isStatus())
                            .duration(eachTask.getDuration())
                            .isLeafNode(eachTask.isLeafNode())
                            .maxTimePerDayInMinute(eachTask.getMaxTimePerDayInMinute());

//                    if (eachTask.getTaskId().equals(idAsFlag)) {
//                        return builder.taskId(null).build();
//                    } else {
//                        return builder.taskId(eachTask.getTaskId()).build();
//                    }
                    return builder.build();
                })
                .collect(Collectors.toCollection(ArrayList::new));

        try {
            taskRepo.saveAll(tasks);
            return true;
        } catch (Exception e) {
            System.err.println("Failed to save data in DB. Something went wrong: " + e.getMessage());
            return false;
        }
    }

    private TaskSchedulerResponse partitionAndSchedule(Task task, LocalDate schedulingStartFrom, boolean isPartition) {
        int daysRemaining = (int) ChronoUnit.DAYS.between(schedulingStartFrom, task.getEndDate());

        if (daysRemaining <= 0)
            return new TaskSchedulerResponse(null, false, 404,
                    "Number of days remaining cannot be less than or equal to zero");
        if (isPartition) {
            List<List<Integer>> partitions = findCombinations(task.getDuration(), daysRemaining,
                    task.getMaxTimePerDayInMinute());

            outer: for (List<Integer> partition : partitions) {
                List<Task> taskList = partitionToTasklist(task, partition);
                for (Task eachTask : taskList) {
                    System.out.println("Trying to add: " + eachTask.getDuration() + " from " + partition);
                    System.out.println(eachTask);
                    boolean isAssigned = scheduler(eachTask, schedulingStartFrom);
                    if (!isAssigned)
                        continue outer;
                }
                if (saveInDB()) {
                    return new TaskSchedulerResponse(taskList, true, 201, "Task scheduled successfully.");
                } else {
                    return new TaskSchedulerResponse(taskList, false, 500, "Failed to save data in DB.");
                }
            }
        } else {
            if (task.getDuration() > task.getMaxTimePerDayInMinute())
                return new TaskSchedulerResponse(null, false, 404,
                        "When partition is disabled, maximum time per day for a task can not be lesser then task duration");

            boolean isAssigned = scheduler(task, schedulingStartFrom);
            if (isAssigned)
                if (saveInDB()) {
                    return new TaskSchedulerResponse(List.of(task), true, 201, "Task scheduled successfully.");
                } else {
                    return new TaskSchedulerResponse(List.of(task), false, 500, "Failed to save data in DB.");
                }
        }

        return new TaskSchedulerResponse(null, false, 409,
                "Task cannot be scheduled due to time conflict with existing calendar entries.");
    }

    private boolean scheduler(Task task, LocalDate schedulingStartFrom) {
        if (tryDirectAssign(task, schedulingStartFrom)) {
            return true;
        } else
            return tryIndirectAssign(task, schedulingStartFrom);
    }

    private void addTaskToDate(LocalDate date, Task task) {
        calender.computeIfAbsent(date, d -> new ArrayList<>()).add(task);
    }

    private void removeTaskById(LocalDate date, String taskId) {
        List<Task> tasks = calender.get(date);
        if (tasks != null) {
            tasks.removeIf(task -> task.getTaskId().equals(taskId));
            if (tasks.isEmpty()) {
                calender.remove(date); // optional cleanup
            }
        }
    }

    public boolean isTaskExists(List<Task> tasks, String id) {
        return tasks.stream().anyMatch(task -> task.getTaskId().equals(id));
    }

    private boolean tryDirectAssign(Task task, LocalDate fromDate) {
        for (Map.Entry<LocalDate, List<Task>> entry : calender.tailMap(fromDate).entrySet()) {
            List<Task> tasks = entry.getValue();
            if (!isTaskExists(tasks, task.getTaskId())) {
                // check - today is before the final date of the task
                if (entry.getKey().isBefore(task.getEndDate())) {
                    int totalDuration = entry.getValue().stream()
                            .mapToInt(Task::getDuration)
                            .sum();
                    int freeTime = dailyTimeLimit - totalDuration;

                    // have enough time to assign the task? if yes then assign
                    if (freeTime >= task.getDuration()) {
                        if (isTaskExists(calender.get(entry.getKey()), task.getTaskId())) {
                            removeTaskById(task.getAssignedDate(), task.getTaskId());
                            task.setAssignedDate(entry.getKey());
                            addTaskToDate(entry.getKey(), task);
                            return true;
                        }
                    }
                } else {
                    break;
                }
            }
        }
        return false;
    }

    private boolean tryIndirectAssign(Task task, LocalDate fromDate) {
        for (Map.Entry<LocalDate, List<Task>> entry : calender.tailMap(fromDate).entrySet()) {
            if (entry.getKey().isBefore(task.getEndDate())) {
                List<Task> tasks = entry.getValue();
                for (Task eachTask : tasks) {
                    if (eachTask.getDuration() > task.getDuration()) {
                        boolean result = scheduler(eachTask, eachTask.getAssignedDate().plusDays(1));
                        if (result) {
                            if (isTaskExists(calender.get(entry.getKey()), task.getTaskId())) {
                                removeTaskById(task.getAssignedDate(), task.getTaskId());
                                task.setAssignedDate(entry.getKey());
                                addTaskToDate(entry.getKey(), task);
                                return true;
                            }
                        }
                    }
                }

                List<Task> lesserTasks = tasks.stream()
                        .filter(t -> t.getDuration() < task.getDuration())
                        .collect(Collectors.toList());
                List<TaskCombination> taskCombinations = findMinimalExcessCombinations(lesserTasks,
                        task.getDuration());

                for (TaskCombination taskCombination : taskCombinations) {
                    int flag = 1;
                    for (Task eachTask : taskCombination.getTasks()) {
                        if (flag == 1) {
                            boolean result = scheduler(eachTask, eachTask.getAssignedDate().plusDays(1));
                            if (!result) {
                                flag = 0;
                            }
                        }
                    }
                    if (flag == 1) {
                        if (isTaskExists(calender.get(entry.getKey()), task.getTaskId())) {
                            removeTaskById(task.getAssignedDate(), task.getTaskId());
                            task.setAssignedDate(entry.getKey());
                            addTaskToDate(entry.getKey(), task);
                            return true;
                        }
                    }
                }
            } else {
                break;
            }
        }
        return false;
    }

    @Getter
    public static class TaskCombination {
        private final List<Task> tasks;
        private final int totalDuration;

        public TaskCombination(List<Task> tasks) {
            this.tasks = new ArrayList<>(tasks);
            this.totalDuration = tasks.stream()
                    .mapToInt(Task::getDuration)
                    .sum();
        }

        public int getSize() {
            return tasks.size();
        }

        public int getExcess(int target) {
            return totalDuration - target;
        }

        @Override
        public String toString() {
            return String.format("Combination{tasks=%s, totalDuration=%d, size=%d}",
                    tasks.stream().map(Task::getLabel).collect(Collectors.toList()),
                    totalDuration, getSize());
        }
    }

    /**
     * Finds combinations that just pass the target value with minimal excess
     * Only keeps combinations where removing any single task would make total <
     * target
     */
    public static List<TaskCombination> findMinimalExcessCombinations(List<Task> tasks, int target) {
        List<TaskCombination> allValidCombinations = new ArrayList<>();

        // Generate all valid combinations (>= target)
        generateCombinations(tasks, 0, new ArrayList<>(), allValidCombinations, target);

        // Filter to keep only minimal combinations
        List<TaskCombination> minimalCombinations = filterMinimalCombinations(allValidCombinations, target);

        // Sort by: 1) Smallest excess, 2) Fewer members
        minimalCombinations.sort((c1, c2) -> {
            int excess1 = c1.getExcess(target);
            int excess2 = c2.getExcess(target);

            if (excess1 != excess2) {
                return Integer.compare(excess1, excess2);
            }
            return Integer.compare(c1.getSize(), c2.getSize());
        });

        return minimalCombinations;
    }

    /**
     * Filters combinations to keep only those where removing any task would drop
     * below target
     */
    private static List<TaskCombination> filterMinimalCombinations(List<TaskCombination> combinations, int target) {
        List<TaskCombination> minimalCombinations = new ArrayList<>();

        for (TaskCombination combination : combinations) {
            if (isMinimalCombination(combination, target)) {
                minimalCombinations.add(combination);
            }
        }

        return minimalCombinations;
    }

    /**
     * Checks if a combination is minimal (removing any task would drop below
     * target)
     */
    private static boolean isMinimalCombination(TaskCombination combination, int target) {
        List<Task> tasks = combination.getTasks();

        // Check if removing any single task would make the total < target
        for (Task task : tasks) {
            int totalWithoutThisTask = combination.getTotalDuration() - task.getDuration();
            if (totalWithoutThisTask >= target) {
                return false; // This task is redundant, combination is not minimal
            }
        }

        return true; // All tasks are necessary
    }

    /**
     * Recursively generates all possible combinations of tasks that meet target
     */
    private static void generateCombinations(List<Task> tasks, int index, List<Task> currentCombination,
                                             List<TaskCombination> validCombinations, int target) {
        // Check if current combination meets the criteria
        if (!currentCombination.isEmpty()) {
            int totalDuration = currentCombination.stream()
                    .mapToInt(Task::getDuration)
                    .sum();
            if (totalDuration >= target) {
                validCombinations.add(new TaskCombination(currentCombination));
                // Continue to explore larger combinations as they might also be minimal
            }
        }

        // Generate combinations by including each remaining task
        for (int i = index; i < tasks.size(); i++) {
            currentCombination.add(tasks.get(i));
            generateCombinations(tasks, i + 1, currentCombination, validCombinations, target);
            currentCombination.removeLast();
        }
    }

    /**
     * partition array to list of task converter utility function
     */
    private static List<Task> partitionToTasklist(Task task, List<Integer> arr) {
        List<Task> tasks = new ArrayList<>();
        for (Integer i : arr) {
            task.setDuration(i);
            tasks.add(task);
        }

        return tasks;
    }

    /**
     * find all possible partition
     */
    private static List<List<Integer>> findCombinations(int sum, int maxArraySize, int maxValue) {
        // Adjust sum to be multiple of quantum
        int adjustedSum = (sum / quantum) * quantum;

        // Convert values to quantum units for easier calculation
        int maxQuantumUnits = maxValue / quantum;
        int minQuantumUnits = minValue / quantum;
        int targetQuantumSum = adjustedSum / quantum;

        Set<List<Integer>> allCombinations = new HashSet<>();

        // Generate all possible combinations
        generateCombinations(allCombinations, new ArrayList<>(), targetQuantumSum,
                maxArraySize, maxQuantumUnits, minQuantumUnits, 0);

        // Convert back to actual values and sort each combination in descending order
        List<List<Integer>> result = new ArrayList<>();
        for (List<Integer> combo : allCombinations) {
            List<Integer> actualValues = new ArrayList<>();
            for (int quantumUnit : combo) {
                actualValues.add(quantumUnit * quantum);
            }
            actualValues.sort(Collections.reverseOrder()); // Descending order
            result.add(actualValues);
        }

        // Sort combinations by higher length first, then by equality distribution
        result.sort(new CombinationComparator());

        return result;
    }

    private static void generateCombinations(Set<List<Integer>> allCombinations,
                                             List<Integer> current, int remainingSum,
                                             int maxSize, int maxQuantumUnits,
                                             int minQuantumUnits, int startValue) {
        // Base case: if remaining sum is 0, add current combination
        if (remainingSum == 0) {
            if (!current.isEmpty()) {
                allCombinations.add(new ArrayList<>(current));
            }
            return;
        }

        // If remaining sum is negative, or we've reached max size, return
        if (remainingSum < 0 || current.size() >= maxSize) {
            return;
        }

        // Try all possible values from startValue to maxQuantumUnits
        // startValue ensures we don't generate permutations
        for (int value = Math.max(startValue, minQuantumUnits); value <= maxQuantumUnits; value++) {
            if (value <= remainingSum) {
                current.add(value);
                generateCombinations(allCombinations, current, remainingSum - value,
                        maxSize, maxQuantumUnits, minQuantumUnits, value);
                current.removeLast();
            }
        }
    }

    // Comparator to sort combinations by higher length first, then by equality
    // distribution
    static class CombinationComparator implements Comparator<List<Integer>> {
        @Override
        public int compare(List<Integer> list1, List<Integer> list2) {
            // First priority: Higher length (larger size first)
            int sizeComparison = Integer.compare(list2.size(), list1.size());
            if (sizeComparison != 0) {
                return sizeComparison;
            }

            // Second priority: Lower variance means more equally distributed
            double variance1 = calculateVariance(list1);
            double variance2 = calculateVariance(list2);
            int varianceComparison = Double.compare(variance1, variance2);
            if (varianceComparison != 0) {
                return varianceComparison;
            }

            // If variances are equal, compare lexicographically (descending order within
            // each list)
            for (int i = 0; i < Math.min(list1.size(), list2.size()); i++) {
                int elementComparison = Integer.compare(list1.get(i), list2.get(i));
                if (elementComparison != 0) {
                    return elementComparison;
                }
            }

            return 0;
        }

        private static double calculateVariance(List<Integer> list) {
            if (list.isEmpty())
                return 0;

            double mean = list.stream().mapToInt(Integer::intValue).average().orElse(0);
            return list.stream()
                    .mapToDouble(x -> Math.pow(x - mean, 2))
                    .average()
                    .orElse(0);
        }
    }
}