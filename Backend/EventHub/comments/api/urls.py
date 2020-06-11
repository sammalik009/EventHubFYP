from .views import CommentViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('Comments', CommentViewSet, basename='comment')
urlpatterns = router.urls
