package com.NullPointers.Atlas.Service;

import com.NullPointers.Atlas.DAO.TaskDao;
import com.NullPointers.Atlas.DTO.*;
import com.NullPointers.Atlas.Entity.Task;
import com.NullPointers.Atlas.Utils.CalculationUtil;
import com.NullPointers.Atlas.Utils.JwtTokenUtil;
import com.NullPointers.Atlas.Utils.PromptUtil;
import com.NullPointers.Atlas.Utils.TreeUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class TaskService {

    @Autowired
    AIService aiService;
    @Autowired
    TaskDao taskDao;

    public String createTask(CreateTaskReqBody createTaskReqBody, String jwtToken) throws JsonProcessingException {
        String taskName = createTaskReqBody.getLabel();
        String taskDescription = createTaskReqBody.getExtraInstruction();
        int remHrs = Math.min(CalculationUtil.calculateTimeRemainingFromCalendar(), CalculationUtil.calculateTimeToBeAssigned(createTaskReqBody.getMaxHourPerDay(), createTaskReqBody.getStartDate(), createTaskReqBody.getEndDate()));
        String taskDepth = createTaskReqBody.getDepth();
        //If syllabus isn't given generate one
        String prompt = PromptUtil.createTaskCall1(taskName, createTaskReqBody.getSyllabus(), taskDescription, remHrs, taskDepth);
        String apiResponse = aiService.apiCall(prompt);
        System.out.println(apiResponse);
        ObjectMapper objectMapper = new ObjectMapper();
        ApiResponseDto apiResponseDto = objectMapper.readValue(apiResponse, ApiResponseDto.class);
        //second api call
        List<Task> tasks = TreeUtil.flattenTree(apiResponseDto);
        String rootId = "";
        for(Task task : tasks) {
            rootId = task.getRootId();
            System.out.println(JwtTokenUtil.getUserIdfromToken(jwtToken));
            task.setAuthorId(JwtTokenUtil.getUserIdfromToken(jwtToken));
            task.setStartDate(createTaskReqBody.getStartDate());
            task.setEndDate(createTaskReqBody.getEndDate());
            task.setRemMin(task.getDuration());
            taskDao.save(task);
        }
        return rootId;
    }

    public TaskTreeDto getWholeTree(String rootId) {
        List<Task> allTasks = taskDao.findAll();
        Map<String, TaskTreeDto> idMap = new HashMap<>();
        Map<String, List<TaskTreeDto>> parentMap = new HashMap<>();

        for (Task task : allTasks) {
            TaskTreeDto dto = new TaskTreeDto();
            dto.setTaskId(task.getTaskId());
            dto.setParentId(task.getParentId());
            dto.setLabel(task.getLabel());
            dto.setAuthorId(task.getAuthorId());
            dto.setStartDate(task.getStartDate());
            dto.setEndDate(task.getEndDate());
            dto.setHrsAssigned(CalculationUtil.MinuteToHours(task.getDuration()));
            dto.setRemHrs(CalculationUtil.MinuteToHours(task.getRemMin()));
            dto.setAssignedDate(task.getAssignedDate());
            dto.setStatus(task.isStatus());
            idMap.put(task.getTaskId(), dto);
            parentMap.computeIfAbsent(task.getParentId(), k -> new ArrayList<>()).add(dto);
        }
        return buildTreeDto(rootId, parentMap, idMap);
    }

    private TaskTreeDto buildTreeDto(String taskId, Map<String, List<TaskTreeDto>> parentMap, Map<String, TaskTreeDto> idMap) {
        TaskTreeDto dto = idMap.get(taskId);
        if (dto == null) return null;
        List<TaskTreeDto> children = parentMap.get(taskId);
        if (children == null || children.isEmpty()) {
            dto.setChildren(null);
        } else {
            for (TaskTreeDto child : children) {
                buildTreeDto(child.getTaskId(), parentMap, idMap);
            }
            dto.setChildren(children);
        }
        return dto;
    }

//    public TaskSchedulerResponse scheduleTheTask(String taskId) {
//        List<Task> taskList = taskDao.findByRootIdAndIsLeafNode(taskId, true);
//
//        if(taskList == null || taskList.isEmpty()){
//            return new TaskSchedulerResponse(null, false, 404, "No data found");
//        }
//
//        LocalDate minStartDate = taskList.stream()
//                .map(Task::getStartDate)
//                .min(Comparator.naturalOrder())
//                .orElse(null);
//
//        LocalDate maxEndDatePlus30 = taskList.stream()
//                .map(Task::getEndDate)
//                .max(Comparator.naturalOrder())
//                .map(date -> date.plusDays(30))
//                .orElse(null);
//
//
//
//        TaskScheduler taskScheduler = new TaskScheduler(taskDao, minStartDate, maxEndDatePlus30);
//
//        List<Task> failedTask = new ArrayList<>();
//        for(Task task : taskList) {
//            if(!taskScheduler.taskScheduler(task, task.getStartDate()).isSuccess()){
//                failedTask.add(task);
//            }
//        }
//        if(failedTask.isEmpty()){
//            return new TaskSchedulerResponse(null, true, 201, "All data scheduled successfully");
//        }
//        return new TaskSchedulerResponse(failedTask, false, 404, "All or some task does not scheduled");
//    }

    public List<Task> createTasks(List<Task> tasks) {
        return taskDao.saveAll(tasks);
    }

    public boolean breakLeafTask(String taskId, int assignedHour) throws JsonProcessingException {
        //delete the assigned date from the calendar data (find the assigned date -> delete this taskId from that date)
        Task tempTask = taskDao.findByTaskId(taskId);
        String prompt = PromptUtil.breakMorePrompt(assignedHour, tempTask.getLabel());
        String apiResponse = aiService.apiCall(prompt);
        System.out.println(apiResponse);
        ObjectMapper objectMapper = new ObjectMapper();
        ApiResponseDto apiResponseDto = objectMapper.readValue(apiResponse, ApiResponseDto.class);
        List<Task> tasks = TreeUtil.flattenTree(apiResponseDto, taskId);
        System.out.println(tasks);
        String rootId = tempTask.getRootId();
        for(Task task : tasks) {
            if(task.getParentId().equals("root"))   {
                task.setTaskId(tempTask.getTaskId());
                task.setParentId(tempTask.getParentId());
                task.setAssignedDate(null);
                task.setLeafNode(false);
                task.setRootId(rootId);
            }
            task.setAuthorId("68514a5e3fa53d441783768a");
            task.setStartDate(tempTask.getStartDate());
            task.setEndDate(tempTask.getEndDate());
            task.setRootId(rootId);
            taskDao.save(task);
        }
        return true;
    }

    public List<Task> getCalendarData(String authorId) {
        List<Task> tempTasks = taskDao.findAllByAuthorId(authorId);
        System.out.println(tempTasks);
        List<Task> finalTasks = new ArrayList<>();
        java.time.LocalDate today = java.time.LocalDate.now();
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();
        for (Task task : tempTasks) {
            if (task.getAssignedDate() != null) {
                java.time.LocalDate assignedDate = task.getAssignedDate();
                int assignedMonth = assignedDate.getMonthValue();
                int assignedYear = assignedDate.getYear();
                System.out.println(task.getAssignedDate());
                System.out.println(assignedDate.getMonthValue());
                System.out.println(assignedDate.getYear());
                if (assignedMonth == currentMonth && assignedYear == currentYear) {
                    finalTasks.add(task);
                }
            }
        }
        System.out.println(finalTasks);
        return finalTasks;
    }

    public List<Task> getAllTasks(String userId) {
        return taskDao.findAllByAuthorId(userId);
    }

    public TaskSchedulerResponse scheduleOneTask(String taskId) {
        Task task = taskDao.findByTaskId(taskId);
        if(task == null){return new TaskSchedulerResponse(null, false, 404, "No data found");}

        List<Task> calender = taskDao.findAll();
        TaskScheduler taskScheduler = new TaskScheduler(taskDao, calender);

        return taskScheduler.taskScheduler(task, task.getStartDate());
}

    public String taskUpdate(TaskUpdateDto taskUpdateDto) {
        Task task = taskDao.findByTaskId(taskUpdateDto.getTaskId());
        if(task==null) {
            return "No task to be found";
        }
        task.setStatus(taskUpdateDto.isCompleted());
        taskDao.save(task);
        // task name, and can also be changed
        return "Updated";
    }
}
