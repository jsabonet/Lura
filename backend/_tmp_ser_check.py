from users.serializers import UserRegistrationSerializer

data = {
    "username": "test_user_qa05",
    "email": "qa05@example.com",
    "password": "StrongPass!123",
    "password_confirm": "StrongPass!123",
    "first_name": "Test",
    "last_name": "User"
}
ser = UserRegistrationSerializer(data=data)
print('is_valid:', ser.is_valid())
print('errors:', ser.errors)
if ser.is_valid():
    u = ser.save()
    print('created:', u.username)
