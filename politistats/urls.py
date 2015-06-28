"""politistats URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
	url(r'^$', 'graphs.views.index', name='index'),
	url(r'^data/all', 'graphs.views.all', name='all'),
	url(r'^data/candidate/info/(?P<cid>.*)', 'graphs.views.candidate_info', name='candidate_info'),
    url(r'^data/candidate/contributions/(?P<cid>.*)/(?P<number>.*)', 'graphs.views.contributions_to_candidates', name='candidate_contributions'),
    url(r'^data/candidate/expenditures/(?P<cid>.*)/(?P<number>.*)', 'graphs.views.candidate_expenditures', name='candidate_expenditures'),
    url(r'^data/candidate/getid/(?P<name>.*)', 'graphs.views.candidate_to_id', name='candidate_to_id'),
    url(r'^data/committee/info/(?P<pid>.*)', 'graphs.views.committee_info', name='committee_info'),
    url(r'^data/committee/contributions/(?P<pid>.*)/(?P<number>.*)', 'graphs.views.committee_contributions', name='committee_contributions'),
    url(r'^admin/', include(admin.site.urls)),
]
