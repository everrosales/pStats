import sys

from django.core.management.base import BaseCommand, CommandError
from graphs.models import Committee

class Command(BaseCommand):
	help = 'Given a file with Committee data info, updates the database'

	def handle(self, *args, **options):
		# Candidates data
		committee_file = "/Users/swu/Documents/Summer/Google/CampaignFin16/cmtes16.txt"

		print committee_file

		infile = open(committee_file)

		for line in infile:
			preinfolist = line.rstrip()[1:].split('|,|')
			infolist = [field.strip(' ') for field in preinfolist] #the last one is to remove trailing spaces
			last_two = infolist[-1].split('|,')
			infolist.pop()
			infolist.append(last_two[0])
			infolist.append(last_two[1])

			new_committee = Committee.objects.create(
				Cycle=infolist[0],
				CmteID=infolist[1],
				PACShort=infolist[2],
				Affiliate=infolist[3],
				Ultorg=infolist[4].encode('utf-8'),
				RecipID=infolist[5],
				RecipCode=infolist[6],
				FECCandID=infolist[7],
				Party=infolist[8],
				PrimCode=infolist[9],
				Source=infolist[10],
				Sensitive=infolist[11],
				Foreign=infolist[12],
				Active=infolist[13]
			)

			print "inserted: " + new_committee.PACShort
			