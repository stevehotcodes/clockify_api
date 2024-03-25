ALTER PROCEDURE InsertAttendanceAndUpdateReportingState
    @attendance_id UNIQUEIDENTIFIER,
    @time_in DATETIME,
    @user_id UNIQUEIDENTIFIER
AS
BEGIN
    BEGIN TRANSACTION;
    
    INSERT INTO attendance (attendance_id, time_in, user_id)
    VALUES (@attendance_id, @time_in, @user_id);

    UPDATE attendance
    SET reporting_state = 
        CASE 
            WHEN DATEPART(HOUR, @time_in) < 9 THEN 'Early'
            WHEN DATEPART(HOUR, @time_in) = 9 THEN 'On Time'
            ELSE 'Late'
        END
    WHERE user_id = @user_id;

    COMMIT TRANSACTION;
END;

-- EXEC InsertAttendanceAndUpdateReportingState 
--     @attendance_id = '91eb7819-e91c-4b90-a209-db6a27412fe4',
--     @time_in = '2024-03-20 11:25:58.337',
--     @user_id = '031a00ca-4d67-48b3-9613-fb8bb89c96c2';
