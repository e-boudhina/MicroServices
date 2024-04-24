
echo "End point reached"
# Wait until MySQL is ready
while ! mysqladmin ping -h "mysql" -u "root" -p"axelites_pwd" --silent; 
do
    echo "Waiting for MySQL to be ready..."
    sleep 1
done

# Start the auth service
npm run start:dev auth

