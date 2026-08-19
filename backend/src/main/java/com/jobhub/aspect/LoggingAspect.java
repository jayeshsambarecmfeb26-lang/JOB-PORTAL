package com.jobhub.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * LoggingAspect - AOP Logging
 *
 * This class uses Spring AOP (Aspect Oriented Programming) to
 * automatically log important actions across the entire application
 * WITHOUT touching any existing service or controller code.
 *
 * What is AOP?
 *  AOP allows us to add extra behaviour (like logging) to existing
 *  code without modifying it. Instead of adding log statements
 *  manually inside every service method, we define them once here
 *  and Spring applies them automatically.
 *
 * This aspect handles three types of logging:
 *  1. Logs every time any service method is called (entry log)
 *  2. Logs execution time of every service method (performance log)
 *  3. Logs any exceptions thrown anywhere in the application (error log)
 *
 * AOP Terminology used here:
 *  - Aspect    : This class itself — contains all logging logic
 *  - Advice    : The actual logging methods (@Before, @Around, @AfterThrowing)
 *  - Pointcut  : The expression that defines WHICH methods to intercept
 *  - JoinPoint : The actual method being intercepted at runtime
 */
@Aspect
@Component
public class LoggingAspect {

    /**
     * Logger instance used to write log messages.
     * Messages appear in the STS console when application runs.
     */
    private static final Logger logger =
            LoggerFactory.getLogger(LoggingAspect.class);

    /**
     * Pointcut Definition
     *
     * Defines which methods this aspect should intercept.
     * This pointcut targets ALL methods inside ALL classes
     * in the com.jobhub.service package.
     *
     * So every method in AuthService, JobService,
     * ApplicationService and ContactService will be intercepted.
     */
    @Pointcut("execution(* com.jobhub.service.*.*(..))")
    public void serviceMethods() {}

    /**
     * Before Advice — Method Entry Log
     *
     * Runs BEFORE every service method is executed.
     * Logs the name of the class and method being called.
     *
     * Example log output:
     * [JobHub] Calling --> JobService.createJob()
     *
     * @param joinPoint - contains info about the method being called
     */
    @Before("serviceMethods()")
    public void logBeforeMethod(JoinPoint joinPoint) {

        // Get the class name (e.g. JobService)
        String className = joinPoint.getTarget()
                .getClass().getSimpleName();

        // Get the method name (e.g. createJob)
        String methodName = joinPoint.getSignature().getName();

        logger.info("[JobHub] Calling --> {}.{}()",
                className, methodName);
    }

    /**
     * Around Advice — Execution Time Log
     *
     * Runs AROUND every service method — before and after.
     * Measures and logs how long each method takes to execute.
     * Useful for identifying slow methods during development.
     *
     * Example log output:
     * [JobHub] JobService.getAllOpenJobs() completed in 45ms
     *
     * @param joinPoint - allows us to proceed with the actual method
     * @return the result of the actual method execution
     */
    @Around("serviceMethods()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint)
            throws Throwable {

        // Record start time before method executes
        long startTime = System.currentTimeMillis();

        // Proceed with the actual method execution
        Object result = joinPoint.proceed();

        // Record end time after method completes
        long endTime = System.currentTimeMillis();

        // Calculate total execution time
        long duration = endTime - startTime;

        String className = joinPoint.getTarget()
                .getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        logger.info("[JobHub] {}.{}() completed in {}ms",
                className, methodName, duration);

        return result;
    }

    /**
     * AfterThrowing Advice — Exception Log
     *
     * Runs ONLY when a service method throws an exception.
     * Logs the error details automatically so we can debug issues.
     * No need to add try-catch blocks in every service method.
     *
     * Example log output:
     * [JobHub] ERROR in JobService.createJob() --> Job not found with id: 5
     *
     * @param joinPoint - contains info about the method that failed
     * @param exception - the actual exception that was thrown
     */
    @AfterThrowing(
            pointcut = "serviceMethods()",
            throwing = "exception"
    )
    public void logException(JoinPoint joinPoint, Exception exception) {

        String className = joinPoint.getTarget()
                .getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        logger.error("[JobHub] ERROR in {}.{}() --> {}",
                className, methodName, exception.getMessage());
    }
}