from django.contrib import admin

from .models import Candidate, Committee, PACtoCandidate, PACtoPAC, IndividualContribution, Expenditure

# Register your models here.
class CandidateAdmin(admin.ModelAdmin):
	class Meta:
		model = Candidate

admin.site.register(Candidate, CandidateAdmin)

class CommitteeAdmin(admin.ModelAdmin):
	class Meta:
		model = Committee

admin.site.register(Committee, CommitteeAdmin)

class PACtoCandidateAdmin(admin.ModelAdmin):
	class Meta:
		model = PACtoCandidate

admin.site.register(PACtoCandidate, PACtoCandidateAdmin)

class PACtoPACAdmin(admin.ModelAdmin):
	class Meta:
		model = PACtoPAC

admin.site.register(PACtoPAC, PACtoPACAdmin)

class IndividualContributionAdmin(admin.ModelAdmin):
	class Meta:
		model = IndividualContribution

admin.site.register(IndividualContribution, IndividualContributionAdmin)

class ExpenditureAdmin(admin.ModelAdmin):
	class Meta:
		model = Expenditure

admin.site.register(Expenditure, ExpenditureAdmin)
