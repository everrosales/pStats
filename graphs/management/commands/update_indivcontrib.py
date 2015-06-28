import sys, datetime, re

from django.core.management.base import BaseCommand, CommandError
from graphs.models import IndividualContribution

class Command(BaseCommand):
	help = 'Given a file with Individual Contribution data, updates the database'

	def handle(self, *args, **options):
		# PactoPac data
		indivcontrib_file = "/Users/swu/Documents/Summer/Google/CampaignFin16/indivs16.txt"

		print indivcontrib_file

		infile = open(indivcontrib_file)

		for line in infile:
			preinfolist = re.split(r'\|\s*,\|', line.rstrip()[1:][:-1])
			infolist = [field.strip(' ') for field in preinfolist] #the last one is to remove trailing spaces
			
			middle_two = infolist[7].split(',')

			infolist.pop(7)
			infolist.append(middle_two[0][:-1])
			infolist.append(datetime.datetime.strptime(middle_two[1], "%m/%d/%Y").strftime("%Y-%m-%d"))
			infolist.append(middle_two[2])
			infolist.append(middle_two[3][1:])

			new_indivcontrib = IndividualContribution.objects.create(
				Cycle = infolist[0],
				FECTransID = infolist[1],
				ContribID = infolist[2],
				Contrib = infolist[3],
				RecipID = infolist[4],
				Orgname = infolist[5],
				UltOrg = infolist[6],
				City = infolist[7],
				State = infolist[8],
				Zip = infolist[9],
				RecipCode = infolist[10],
				Type = infolist[11],
				CmtelID = infolist[12],
				OtherID = infolist[13],
				Gender = infolist[14],
				Microfilm = infolist[15],
				Occupation = infolist[16],
				Employer = infolist[17],
				Source = infolist[18],
				RealCode = infolist[19],
				Date = infolist[20],
				Amount = infolist[21],
				Street = infolist[22]
			)

			print "inserted: " + new_indivcontrib.FECTransID
