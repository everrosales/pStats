import sys, re

from django.core.management.base import BaseCommand, CommandError
from graphs.models import Candidate

class Command(BaseCommand):
	help = 'Given a file with candidate data info, updates the database'

	def handle(self, *args, **options):
		# Candidates data
		candidate_file = "/Users/swu/Documents/Summer/Google/CampaignFin16/cands16.txt"

		print candidate_file

		infile = open(candidate_file)

		for line in infile:
			infolist = line.rstrip()[1:][:-1].split('|,|')

			new_candidate = Candidate.objects.create(
				Cycle=infolist[0],
				FECCandID=infolist[1],
				CID=infolist[2],
				FirstLastP=infolist[3],
				Party=infolist[4],
				DistIDRunFor=infolist[5],
				DistIDCurr=infolist[6],
				CurrCand=infolist[7],
				CycleCand=infolist[8],
				CRPICO=infolist[9],
				RecipCode=infolist[10],
				NoPacs=infolist[11]
			)

			print "inserted: " + new_candidate.FirstLastP
			