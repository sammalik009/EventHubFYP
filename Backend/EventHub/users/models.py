from django.db import models
from events.models import Event
from django.core.validators import MinLengthValidator
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager)


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False)

    class Meta:
        abstract = True


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, is_admin=False, is_organizer=False, active=False):
        if not email:
            raise ValueError("Users must have an email")
        if not username:
            raise ValueError("Users must have a unique name")
        if not password:
            raise ValueError("Users must have a password")
        user_obj = self.model(
            email=self.normalize_email(email)
        )
        user_obj.set_password(password)
        user_obj.username = username
        user_obj.is_admin = is_admin
        user_obj.active = active
        user_obj.is_organizer = is_organizer
        user_obj.save(using=self._db)
        return user_obj

    def create_superuser(self, username, email, password):
        print(username, email, password)
        user = self.create_user(
            username=username,
            email=email,
            password=password,
            is_admin=True,
            is_organizer=True,
        )
        return user

    def create_organizeruser(self, username, email, password):
        user = self.create_user(
            username=username,
            email=email,
            password=password,
            is_admin=False,
            is_organizer=True,
        )
        return user


class User(AbstractBaseUser, BaseModel):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True, max_length=255)
    is_organizer = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def __str__(self):
        return self.username

    @property
    def is_an_organizer(self):
        return self.is_organizer

    @property
    def is_an_admin(self):
        return self.is_admin

    @property
    def is_active(self):
        return self.active

    @property
    def is_staff(self):
        return self.is_organizer

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def has_module_perms(self, app_label):
        return self.is_admin


class Organizer(BaseModel):
    address = models.CharField(max_length=255)
    cnic = models.DecimalField(decimal_places=0, max_digits=13)
    phone_number = models.DecimalField(decimal_places=0, max_digits=11)
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return str(self.phone_number)


class Request(BaseModel):
    event_title = models.CharField(max_length=255)
    type = models.CharField(max_length=10)
    status = models.CharField(max_length=15)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class OrganizerRequest(BaseModel):
    user_name = models.CharField(max_length=255)
    status = models.CharField(max_length=15)
    organizer = models.ForeignKey(Organizer, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user_name
