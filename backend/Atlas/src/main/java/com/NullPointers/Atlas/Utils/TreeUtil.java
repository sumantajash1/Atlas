package com.NullPointers.Atlas.Utils;

import com.NullPointers.Atlas.DTO.ApiResponseDto;
import com.NullPointers.Atlas.Entity.Task;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TreeUtil {
    public static List<Task> flattenTree(ApiResponseDto apiResponseDto) {
        List<Task> flatList = new ArrayList<>();
        String rootId = "";
        flattenTreeHelper(apiResponseDto, flatList, rootId);
        return flatList;
    }

    private static void flattenTreeHelper(ApiResponseDto node, List<Task> flatList, String rootId) {
        if(node == null) {
            return;
        }
        Task task = new Task();
        task.setTaskId(UUID.randomUUID().toString());
        task.setLabel(node.getLabel());
        task.setDuration(CalculationUtil.HoursToMinutes(node.getEstimatedHours()));
        task.setRemMin(task.getDuration());
        if(!node.getParentLabel().equals("root")) {
            task.setRootId(rootId);
            for(Task t : flatList) {
                if(t.getLabel().equals(node.getParentLabel())) {
                    task.setParentId(t.getTaskId());
                    break;
                }
            }
        } else {
            rootId = task.getTaskId();
            task.setParentId("root");
            task.setRootId("root");
        }
        flatList.add(task);
        if (node.getChildren() == null || node.getChildren().isEmpty()) {
            task.setLeafNode(true);
        } else {
            for (ApiResponseDto child : node.getChildren()) {
                flattenTreeHelper(child, flatList, rootId);
            }
        }
    }

    public static List<Task> flattenTree(ApiResponseDto apiResponseDto, String taskId) {
        List<Task> flatList = new ArrayList<>();
        String rootId = "";
        flattenTreeHelper(apiResponseDto, flatList, taskId, rootId);
        return flatList;
    }

    private static void flattenTreeHelper(ApiResponseDto node, List<Task> flatList, String taskId, String rootId) {
        if(node == null) {
            return;
        }
        Task task = new Task();

        task.setLabel(node.getLabel());
        task.setDuration(CalculationUtil.HoursToMinutes(node.getEstimatedHours()));
        task.setRemMin(CalculationUtil.HoursToMinutes(node.getEstimatedHours()));
        System.out.println(task.getLabel() + CalculationUtil.HoursToMinutes(node.getEstimatedHours()));
        if(!node.getParentLabel().equals("root")) {
            task.setTaskId(UUID.randomUUID().toString());
            for(Task t : flatList) {
                if(t.getLabel().equals(node.getParentLabel())) {
                    task.setParentId(t.getTaskId());
                    break;
                }
            }
        } else {
            task.setTaskId(taskId);
            task.setParentId("root");
        }
        flatList.add(task);
        if(node.getChildren() != null) {
            for(ApiResponseDto child : node.getChildren()) {
                flattenTreeHelper(child, flatList, taskId, rootId);
            }
        }
    }

}
