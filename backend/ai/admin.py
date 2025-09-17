from django.contrib import admin
from .models import AIConversation, AIMessage, AIUsageStats, AIFeedback


@admin.register(AIConversation)
class AIConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title', 'conversation_type', 'model_used', 'created_at', 'is_active']
    list_filter = ['conversation_type', 'model_used', 'is_active', 'created_at']
    search_fields = ['user__username', 'user__email', 'title']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(AIMessage) 
class AIMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'conversation', 'role', 'content_preview', 'timestamp', 'processing_time']
    list_filter = ['role', 'timestamp', 'conversation__conversation_type']
    search_fields = ['content', 'conversation__user__username']
    readonly_fields = ['timestamp', 'metadata', 'token_usage', 'processing_time']
    date_hierarchy = 'timestamp'
    
    def content_preview(self, obj):
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Conteúdo'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('conversation', 'conversation__user')


@admin.register(AIUsageStats)
class AIUsageStatsAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'date', 'total_requests', 'total_tokens_used', 
        'agriculture_requests', 'pest_analysis_requests', 'total_processing_time'
    ]
    list_filter = ['date', 'user']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(AIFeedback)
class AIFeedbackAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'rating', 'is_helpful', 'is_accurate', 'created_at']
    list_filter = ['rating', 'is_helpful', 'is_accurate', 'created_at']
    search_fields = ['user__username', 'comment']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'message')
