package com.NullPointers.Atlas.DAO;

import com.NullPointers.Atlas.Entity.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskDao extends MongoRepository<Task, String> {

    List<Task> findByRootIdAndIsLeafNode(String taskId, boolean b);

    List<Task> findByAssignedDateBetween(LocalDate startDate, LocalDate endDate);

    Task findByTaskId(String taskId);

    List<Task> findByAuthorIdAndAssignedDateIsNotNull(String authorId);

    List<Task> findAllByAuthorId(String authorId);
}
