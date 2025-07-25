package com.NullPointers.Atlas.Controller;

import com.NullPointers.Atlas.DTO.*;
import com.NullPointers.Atlas.DTO.TaskSchedulerResponse;
import com.NullPointers.Atlas.Entity.Task;
import com.NullPointers.Atlas.Service.TaskService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@RequestMapping("/task")
@RestController
public class TaskController {
    @Autowired
    TaskService taskService;

    @PostMapping("/createTasks")
    public ResponseEntity<String> crateTask(@RequestBody CreateTaskReqBody createTaskReqBody, HttpServletRequest request) throws JsonProcessingException {
        String taskServiceResponse = taskService.createTask(createTaskReqBody, request.getHeader("Authorization").substring(7));
        if(taskServiceResponse.equals("Error")) {
            return ResponseEntity.badRequest().body("Couldn't Create Task");
        }
        return ResponseEntity.ok(taskServiceResponse);
    }

//    @PostMapping("/scheduleTasks")
//    public ResponseEntity<String> scheduleTask(@RequestBody String taskId) throws JsonProcessingException {
//        TaskSchedulerResponse taskSchedulerResponse = taskService.scheduleTheTask(taskId);
//        if(!taskSchedulerResponse.isSuccess()) {
//            return ResponseEntity.badRequest().body(taskSchedulerResponse.getStatusMessage().toString());
//        }
//        return ResponseEntity.ok(taskSchedulerResponse.getStatusMessage());
//    }

    @PostMapping("/addTask/bulk")
    public List<Task> addMultipleTasks(@RequestBody List<Task> tasks) throws JsonProcessingException {
        return taskService.createTasks(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskTreeDto> wholeTree(@PathVariable("id") String id) {
        TaskTreeDto taskTreeDto = taskService.getWholeTree(id);
        return ResponseEntity.ok(taskTreeDto);
    }

    @PostMapping("/breakLeafTask")
    public ResponseEntity<String> breakLeafTask(@RequestBody BreakLeafTaskDto breakLeafTaskDto) throws JsonProcessingException {
        if(taskService.breakLeafTask(breakLeafTaskDto.getTaskId(), breakLeafTaskDto.getAssignedHour())) {
            return ResponseEntity.ok("Task is divided into more subtasks");
        }
        else return ResponseEntity.badRequest().body("couldn't be broken into more subtasks");
    }

    @GetMapping("/CalendarData/{userId}")
    public ResponseEntity<List<Task>> CalendarData(@PathVariable("userId") String userId) {
        List<Task> calendarData = taskService.getCalendarData(userId);
        if(calendarData.isEmpty()) {
            ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(calendarData);
    }

    @GetMapping("/allTasks/{userId}")
    public ResponseEntity<List<Task>> allTasks(@PathVariable("userId") String userId) {
        log.info("-------> UserId : " + userId);
        return ResponseEntity.ok(taskService.getAllTasks(userId));
    }

    @PostMapping("/scheduleOneTask")
    public ResponseEntity<String> scheduleOneTask(@RequestBody String taskId) throws JsonProcessingException {
        TaskSchedulerResponse taskSchedulerResponse = taskService.scheduleOneTask(taskId);
        if(!taskSchedulerResponse.isSuccess()) {
            return ResponseEntity.badRequest().body(taskSchedulerResponse.getStatusMessage().toString());
        }
        return ResponseEntity.ok(taskSchedulerResponse.getStatusMessage());
    }

    @PostMapping("/updateTask")
    public String updateTask(@RequestBody TaskUpdateDto taskUpdateDto) {
        return taskService.taskUpdate(taskUpdateDto);
    }

}
