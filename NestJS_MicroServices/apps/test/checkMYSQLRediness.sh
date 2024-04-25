
echo "End point reached"
# Wait until MySQL is ready
#If you want to pass the password directly without being prompted, you MUST use the -p option without a space following it.
while ! mysqladmin ping -h "mysql" -u "root" -p"axelites_pwd" --silent; 
do
    echo "Waiting for MySQL to be ready..."
    #Pause the execution of the script for 1 second
    sleep 1
done

# Echo message when MySQL is live
echo " ======== > MySQL is live < ========"
# Start the auth service
npm run start:dev auth

