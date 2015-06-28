from itertools import chain
import json
from operator import attrgetter

from django.core import serializers
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render

from .models import Candidate, Committee, PACtoCandidate, PACtoPAC, IndividualContribution, Expenditure

def index(request):
	return render(request, "graphs/index.html", locals())

def all(request):
	response_dict = {}
	response_list = []

	all_candidates = Candidate.objects.all()
	for candidate in all_candidates:
		record = {
			'name': candidate.FirstLastP, 
			'id': candidate.CID
		}
		response_list.append(record)

	all_committees = Committee.objects.all()
	for committee in all_committees:
		record = {
			'name': committee.PACShort, 
			'id': committee.CmteID
		}
		response_list.append(record)

	response_dict["records"] = response_list

	return JsonResponse(response_dict)

def candidate_info(request, cid):
	return HttpResponse(serializers.serialize("json", Candidate.objects.filter(CID=cid)))

def contributions_to_candidates(request, cid, number):
	response_dict = {}
	response_list = []

	pac_contrib_list = PACtoCandidate.objects.filter(CID=cid).order_by('-Amount')
	indiv_contrib_list = IndividualContribution.objects.filter(RecipID=cid).order_by('-Amount')		

	result_list = sorted(
		chain(pac_contrib_list, indiv_contrib_list),
		key=attrgetter('Amount'),
		reverse=True
	)

	for result in result_list:

		# PAC record
		if hasattr(result, 'PACID'):
			committee = Committee.objects.filter(CmteID=result.PACID)[0]
			record = {
				'amount': result.Amount,
				'pac_id': result.PACID,
				'pac_name': committee.PACShort,
				'pac_party': committee.Party
			}
		else:
		# Individual record
			record = {
				'amount': result.Amount,
				'individual_name': result.Contrib,
				'individual_employer': result.Employer
			}
		response_list.append(record)

	if number:
		response_list = response_list[:15]

	candidate = Candidate.objects.filter(CID=cid)[0]
	info_dict = {
		"name": candidate.FirstLastP,
		"party": candidate.Party
	}

	response_dict["records"] = response_list
	response_dict["info"] = info_dict

	return JsonResponse(response_dict)

def candidate_expenditures(request, cid):
	response_dict = {}
	response_list = []

	expenditure_list = Expenditure.objects.filter(CRPFilerid=cid)
	for expenditure in expenditure_list:
		record = {
			'amount': expenditure.Amount,
			'recipient_code': expenditure.Recipcode,
			'recipient_name': expenditure.CRPRecipname,
			'description': expenditure.Descrip
		}
		response_list.append(record)

	response_dict["records"] = response_list[:5]

	return JsonResponse(response_dict)

def candidate_to_id(request, name):
	candidate = Candidate.objects.filter(FirstLastP=name)[0]
	return JsonResponse({'id':candidate.CID})

def committee_info(request, pid):
	return HttpResponse(serializers.serialize("json", Committee.objects.filter(CmteID=pid)))

def committee_contributions(request, pid, number):
	response_dict = {}
	response_list = []

	pac_candidate_contrib_list = PACtoCandidate.objects.filter(PACID=pid).order_by('-Amount')
	pac_pac_contrib_list = PACtoPAC.objects.filter(Filerid=pid).order_by('-Amount')

	result_list = sorted(
		chain(pac_candidate_contrib_list, pac_pac_contrib_list),
		key=attrgetter('Amount'),
		reverse=True
	)

	for contribution in result_list:
		if hasattr(contribution, 'CID') and Candidate.objects.filter(CID=contribution.CID):
			candidate = Candidate.objects.filter(CID=contribution.CID)[0]
			record = {
				'amount': contribution.Amount,
				'candidate_id': candidate.CID,
				'candidate_name': candidate.FirstLastP,
				'candidate_party': candidate.Party
			}
			response_list.append(record)
		elif hasattr(contribution, 'RecipID') and Committee.objects.filter(CmteID=contribution.RecipID):
			committee = Committee.objects.filter(CmteID=contribution.RecipID)[0]
			record = {
				'amount': contribution.Amount,
				'pac_id': contribution.RecipID,
				'pac_name': committee.PACShort,
				'pac_party': contribution.Party
			}
			response_list.append(record)
		

	if number:
		response_list = response_list[:15]

	committee = Committee.objects.filter(CmteID=pid)[0]
	info_dict = {
		"name": committee.PACShort,
		"party": committee.Party
	}

	response_dict["records"] = response_list
	response_dict["info"] = info_dict

	return JsonResponse(response_dict)
