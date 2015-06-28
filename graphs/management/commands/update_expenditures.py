import sys, re, datetime

from django.core.management.base import BaseCommand, CommandError
from graphs.models import Expenditure

class Command(BaseCommand):
	help = 'Given a file with Expenditure data, updates the database'

	def handle(self, *args, **options):
		# Expenditure data
		expenditure_file = "/Users/swu/Documents/Summer/Google/Expend16/expends16.txt"

		print expenditure_file

		infile = open(expenditure_file)

		for line in infile:
			infolist = line.rstrip()[1:][:-2].split('|,|')
			first = infolist[0].split('|')
			infolist.insert(0, first[0])
			infolist[1] = first[2]

			middle = infolist[6].split(',')

			infolist[6] = middle[0][:-1]
			infolist.insert(7, middle[1])
			infolist.insert(8, middle[2])
			infolist.insert(9, middle[3][1:])

			infolist[11] = infolist[11].strip()

			if len(infolist) == 19:
				infolist.append('')

			new_expenditure = Expenditure.objects.create(
				Cycle= infolist[0],
				TransID = infolist[1],
				CRPFilerid = infolist[2],
				Recipcode = infolist[3],
				Pacshort = infolist[4],
				CRPRecipname = infolist[5],
				Expcode = infolist[6],
				Amount = infolist[7],
				Date = datetime.datetime.strptime(infolist[8], "%m/%d/%Y").strftime("%Y-%m-%d"),
				City = infolist[9],
				State = infolist[10],
				Zip = infolist[11],
				CmteID_EF = infolist[12],
				Candid = infolist[13],
				Type = infolist[14],
				Descrip = infolist[15],
				PG = infolist[16],
				ElecOther = infolist[17],
				EntType = infolist[18],
				Source = infolist[19]
			)

			print "inserted: " + new_expenditure.TransID
