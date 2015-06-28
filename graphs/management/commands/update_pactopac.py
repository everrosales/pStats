import sys, datetime

from django.core.management.base import BaseCommand, CommandError
from graphs.models import PACtoPAC

class Command(BaseCommand):
	help = 'Given a file with PAC to PAC data info, updates the database'

	def handle(self, *args, **options):
		# PactoPac data
		pactopac_file = "/Users/swu/Documents/Summer/Google/CampaignFin16/pac_other16.txt"

		print pactopac_file

		infile = open(pactopac_file)

		for line in infile:
			preinfolist = line.rstrip()[1:][:-1].split('|,|')
			infolist = [field.strip(' ') for field in preinfolist] #the last one is to remove trailing spaces
			
			middle_two = infolist[9].split(',')
			
			infolist.pop(9)
			infolist.append(middle_two[0][:-1])
			infolist.append(datetime.datetime.strptime(middle_two[1], "%m/%d/%Y").strftime("%Y-%m-%d"))
			infolist.append(middle_two[2])
			infolist.append(middle_two[3][1:])

			new_pactopac = PACtoPAC.objects.create(
				Cycle = infolist[0],
				FECRecNo = infolist[1],
				Filerid = infolist[2],
				DonorCmte = infolist[3],
				ContribLendTrans = infolist[4],
				City = infolist[5],
				State = infolist[6],
				Zip = infolist[7],
				FECOccEmp = infolist[8],
				Party = infolist[9],
				Otherid = infolist[10],
				RecipCode = infolist[11],
				RecipPrimcode = infolist[12],
				Amend = infolist[13],
				Report = infolist[14],
				PG = infolist[15],
				Microfilm = infolist[16],
				Type = infolist[17],
				RealCode = infolist[18],
				Source = infolist[19],
				PrimCode = infolist[20],
				Date = infolist[21],
				Amount = infolist[22],
				RecipID = infolist[23]
			)

			print "inserted: " + new_pactopac.FECRecNo
			