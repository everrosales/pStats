import sys, datetime

from django.core.management.base import BaseCommand, CommandError
from graphs.models import PACtoCandidate

class Command(BaseCommand):
	help = 'Given a file with PAC to Candidate data info, updates the database'

	def handle(self, *args, **options):
		# Candidates data
		pactocand_file = "/Users/swu/Documents/Summer/Google/CampaignFin16/pacs16.txt"

		print pactocand_file

		infile = open(pactocand_file)

		for line in infile:
			infolist = line.rstrip()[1:][:-1].split('|,|')
			middle_two = infolist[3].split(',')
			infolist.pop(3)
			infolist.append(middle_two[0][:-1])
			infolist.append(middle_two[1])
			infolist.append(datetime.datetime.strptime(middle_two[2], "%m/%d/%Y").strftime("%Y-%m-%d"))
			infolist.append(middle_two[3][1:])

			new_pactocand = PACtoCandidate.objects.create(
				Cycle = infolist[0],
				FECRecNo = infolist[1],
				PACID = infolist[2],
				Type = infolist[3],
				DI = infolist[4],
				FECCandID = infolist[5],
				CID = infolist[6],
				Amount = infolist[7],
				Date = infolist[8],
				RealCode = infolist[9]
			)

			print "inserted: " + new_pactocand.FECRecNo
			