DEBUG = True
TEMPLATE_DEBUG = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        'NAME': 'politistats',
        'USER': 'swu',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '',
    }
}