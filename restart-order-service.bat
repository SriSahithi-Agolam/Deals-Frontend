@echo off
echo Restarting Order Service with Fixed Feign Clients...
echo.
echo The following changes were made:
echo 1. Added explicit URLs to all Feign clients
echo 2. UserClient now points to http://localhost:8082
echo 3. MerchantClient now points to http://localhost:8083
echo 4. PaymentClient now points to http://localhost:8086
echo 5. DealClient now points to http://localhost:8084
echo 6. CashbackClient now points to http://localhost:8087
echo.
echo Please restart the Order Service manually:
echo 1. Stop the order service (Ctrl+C in its terminal)
echo 2. Navigate to: C:\Users\ssrisahi\OneDrive - Capgemini\Desktop\casestudyy\order-service
echo 3. Run: mvn spring-boot:run
echo.
echo After restart, the order creation should work properly!
pause