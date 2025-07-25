package com.NullPointers.Atlas.Utils;

public class PromptUtil {

    public static String createTaskCall1(String taskName, String Syllabus, String taskDescription, int remHrs, String taskDepth) {
        if(taskDescription==null || taskDescription.isEmpty()) {
            taskDescription = "empty";
        }
        return
                "You are a smart scheduling assistant helping users break down and plan tasks efficiently.\n" +
                        "\n" +
                        "Given the following task details:\n" +
                        "\n" +
                        "- Task Name: " + taskName + "\n" +
                        "- Syllabus: " + Syllabus + "\n" +
                        "- Task Description: " + taskDescription + "\n" +
                        "- Time Left to Deadline (in hours): " + remHrs + "\n" +
                        "- Depth of Understanding Desired: " + taskDepth + " (can be \"Overview\", \"Shallow\", or \"Detailed\")\n" +
                        "\n" +
                        "Your job is to:\n" +
                        "1. Estimate the actual number of hours realistically required to complete the task based on the depth:\n" +
                        "   - Overview → ~10–15% of total time available\n" +
                        "   - Shallow → ~25–40%\n" +
                        "   - Detailed → ~70–100%\n" +
                        "\n" +
                        "2. DO NOT stretch the task to fill the entire available " + remHrs + " hours — only use the estimated necessary time based on the depth.\n" +
                        "\n" +
                        "3. Break the task down into a nested tree of subtasks, where each task has:\n" +
                        "   - A clear \"label\" describing the subtask\n" +
                        "   - A \"level\" (starting from 0 for the root task, increasing by 1 per level)\n" +
                        "   - A meaningful \"estimatedHours\" for each node\n" +
                        "   - A \"parentLabel\" field which is the **label of its immediate parent** (set to null for the root task)\n" +
                        "   - A \"children\" array containing further subtasks\n" +
                        "\n" +
                        "4. No leaf node should be assigned less than 60 minutes (1 hours) of time.\n" +
                        "5. No leaf node should be assigned more than 240 minutes (4 hours) of time. \n" +
                        "6. No leaf node should be assigned 0 hours, make sure to distribute the time left, to each and every Task"+
                        "7. Respond in the following flexible JSON format:\n" +
                        "The task that is being broken down, that's parentlabel should be root, basically the actuall root parent task"+
                        "\n" +
                        "[\n" +
                        "  {\n" +
                        "    \"label\": \"" + taskName + "\",\n" +
                        "    \"level\": 0,\n" +
                        "    \"estimatedHours\": totalEstimatedHours,\n" +
                        "    \"parentLabel\": \"root\",\n" +
                        "    \"children\": [\n" +
                        "      {\n" +
                        "        \"label\": \"Subtask A\",\n" +
                        "        \"level\": 1,\n" +
                        "        \"estimatedHours\": 5,\n" +
                        "        \"parentLabel\": \"" + taskName + "\",\n" +
                        "        \"children\": [\n" +
                        "          {\n" +
                        "            \"label\": \"Sub-subtask A1\",\n" +
                        "            \"level\": 2,\n" +
                        "            \"estimatedHours\": 2,\n" +
                        "            \"parentLabel\": \"Subtask A\",\n" +
                        "            \"children\": []\n" +
                        "          }\n" +
                        "        ]\n" +
                        "      },\n" +
                        "      {\n" +
                        "        \"label\": \"Subtask B\",\n" +
                        "        \"level\": 1,\n" +
                        "        \"estimatedHours\": 4,\n" +
                        "        \"parentLabel\": \"" + taskName + "\",\n" +
                        "        \"children\": []\n" +
                        "      }\n" +
                        "    ]\n" +
                        "  }\n" +
                        "]\n" +
                        "\n" +
                        "5. The structure must be meaningful and logical. Do NOT enforce a uniform number of children or structure depth — it should depend on the nature of the task.\n" +
                        "\n";
    }

    public static String breakMorePrompt(int assignedHours, String label) {
        return
                "You are a task refinement assistant.\n" +
                        "Given a task that is marked as too heavy (leaf-level task), your goal is to break it down into simpler, more manageable subtasks.\n" +
                        "\n" +
                        "Inputs:\n" +
                        "- TaskLabel:"+ label + "this is the task being broken down\n" +
                        "- AssignedHours: " + assignedHours + "\n" +
                        "\n" +
                        "Instructions:\n" +
                        "1. Break down the" + label + "task into minimum 2 to maximum 4 meaningful subtasks.\n" +
                        "2. These subtasks must have:\n" +
                        "   • label: A clear, focused task name\n" +
                        "   • ParentLabel: \"root\"\n" +
                        "   • level: 1 (since they're direct children of the root task)\n" +
                        "   • estimatedHours: Estimated time it will realistically take for that subtask\n" +
                        "   • children: [] (leave it empty)\n" +
                        "3. The **sum of all estimatedHours across subtasks must not exceed** the AssignedHours.\n" +
                        "4. Do NOT distribute hours equally or proportionally. Assign hours based on how demanding each subtask is.\n" +
                        "5. No leaf node should be assigned less than 60 minutes (1 hours) of time.\n" +
                        "6. In the Json format that you'll return, the parentTask, that task you're breaking down, that parent task's label should be - root" +
                        "\n" +
                        "Output Format:\n" +
                        "Return ONLY a JSON array like this:\n" +

                        "{\n" +
                        "  \"label\": " + label + ",\n" +
                        "  \"parentLabel\": \"root\",\n" +
                        "  \"level\": 1,\n" +
                        "  \"estimatedHours\": " + assignedHours + ",\n" +
                        "  \"children\": [\n" +
                        "    {\n" +
                        "      \"label\": \"<subtask name 1>\",\n" +
                        "      \"parentLabel\": " + label + ",\n" +
                        "      \"level\": 2,\n" +
                        "      \"estimatedHours\": <int>,\n" +
                        "      \"children\": []\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"label\": \"<subtask name 2>\",\n" +
                        "      \"parentLabel\": " + label + ",\n" +
                        "      \"level\": 2,\n" +
                        "      \"estimatedHours\": <int>,\n" +
                        "      \"children\": []\n" +
                        "    }\n" +
                        "    // ... up to 4 subtasks\n" +
                        "  ]\n" +
                        "}" +
                        "\n" +
                        "Now break the task labeled 'root' into smaller subtasks.";
    }
}
