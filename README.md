# license-analytics
2018 Boilerman VI Project

# Team Members:
	Josh Kassman
	Chris Rossenblatt
	Vikas Tatineni
	
# Description:
	A web app that scans the magstrip of an individual's drivers license to determine the license's validity.
	Can differentiate between fake IDs and real ones.
	Can also determine if an individual is of legal age for various activities.
	Some of the license data (gender, age, and zipcode) is then taken and stored in a MongoDB Stitch database for data analysis.
    Analysis computed from data include graphs of data distribution based on inviduals' characteristics.
    
# Why:
	The web app was created to help bouncers and other individuals quickly determine if a form of identification was valid.
	The web app was also created to help bars and other firms get data on their customers for better consumer-relationship management.
	
# How:
	We used React.JS for the front-end UI and parsing of the magstrip information into a JSON format.
	All data was parsed and sent to a MonogoDB Stitch database where it was stored for data analytics.
	Plot.ly was used to graph and show trends of the data.

# Challenges:
	Correctly and consistently parsing the magstrip information from the driver's license
	Sending the JSON objects to the mongoDB Stitch Database
	Making sure the Web App UI rendered correctly based on the magstrip information
	Working with Javascript.

