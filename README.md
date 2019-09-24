# Milestone Project 2: UFO Sightings Around The World

Please click [here for a live demo of the website.](https://squelsh84.github.io/milestone-UFO/).

![Responsive Dashboard](https://github.com/Squelsh84/milestone-UFO/blob/master/static/images/responsive.png)

## Introduction
This data dashboard is designed to show the UFO sightings reported around the globe in 1984. Most of the reported sightings have come from the United States but UFO's have also been spotted across the globe. Along with the country the UFO was spotted in, we can also see the shape of the UFO that was reported and some comments made by the people when first reporting it.  



## UX

### What is it?
It's a clean Single Page Application dashboard that informs the users of ufo sightings around the globe using various charts, pie-charts, composite charts and stacked barcharts. 


### Who is the target audience?
This Dashboard is for people who are curious about all the extraterrestrial activities that have happened around the globe. Whether you're skeptical about it or a true believer in UFO's it's always something that draws up conversation amongst people. 

### User stories
As a user, I want:
1.	To be able to easily navigate through the site.
2.	To be able to filter through the data to specific dates or shapes.
3.	To get a feeling of real interaction while using it.
4.	To enjoy it.
5.  To see what country has the most reports.


## Features

### Existing features

##### Sidebar
*  The sidebar contains trivia about the most famous ufo sighting. It is collapsable with a button placed in the top Navbar.

#####  NavBar
*  Navbar contains a reset chart button  to help the user with their experience. Also a button is in place to open and close the         sidebar.

##### Refresh Chart Button
*  This allows the user to Refresh the charts when called upon.

#####  Pie charts
* This pie charts displays the countries and the shapes of the reported sightings. 

##### Dropdown selectors
* These allow the user to choose specific information across the spa dashboard.

##### Composite Chart
* The composite chart displays the number of sighting along a timeline. It gives a great visual display to what months and countries    more  UFO's have been spotted and where there has been the most activity.

##### Stacked bar chart
* The stacked Barchart shows the user the contry and types of sighting stcked on top of each other.

##### Data Table
* All the reports from the year can be seen in the datatable. Also inclueded are the comments from the people on that day.

##### Sighting Map
* This map shows all the sighting in the year on the map. Each spaceship when clicked on shows the city where it was seen. Also you can zoom ii and out to see.


### Features Left to Implement

*  I would like to map the map more interactive. So when certain information is selected in a chart it also shows on the map.

*  To use all the information from the full report and have it constantly updating.



## Technologies used
•	HTML 

•	CSS 

• [JavaScript] The dashboard uses Javascript to provide dynamic interactivity, as it is a full-fledged versatile programming language.

•	[Visual Code Studio](https://code.visualstudio.com/) 

•	[Bootstrap](https://getbootstrap.com/) for the grid system of the page.

•	[Google Fonts](https://fonts.google.com/) for the fonts.

•	[JQuery](https://jquery.com/) to simplify the JavaScript.

•	Crossfilter The graphs and charts on the dashboard are all linked using crossfilter, which manages the data behind the graphs and     charts, allowing interaction with coordinated views and functioning. It synchronises all the charts when used.

•	DC.js The dashboard uses DC.js for data visualisation and analysis. 

•	D3.js The D3.js library allows manipulation of elements on the dashboard in the context of the dataset.

•	Leaflet.js Used to create the map.

•	Google Chrome developer tools.

•	Bash / Ubuntu to commit my project and to push it to Github.

•	[Git](https://github.com/) for version control and for users to view the deployed version of the website.

## Testing

* Used Google Chrome developer tools to test website responsiveness across multiple devices such as Tablets and Mobiles.

* Tested refresh chart button to make sure it refreshed the page.

* Tested the sidebar button to ensure it opened and closed. This was domne by testing all different screen sizes.

* Tested the back to top button to check functionality. This was done by scrolling down and clicking button.

* 




* Used [W3c validator](https://validator.w3.org/) to validate both HTML and CSS. I copied my code and pasted it into the validator to   check for errors and warnings.

*	JSHint was used to validate JavaScript.


## Deployment

The website was developed using Cloud9 IDE, it was then committed to git and pushed to GitHub using the terminal in Cloud9.

To deploy this page to GitHub Pages from its GitHub repository, the following steps were taken:

- Log into GitHub.
- Select the repository **Squelsh84/milestone-UFO**.
- At the top of the page, select **Settings**.
- Scroll down to the GitHub Pages section.
- Under Source, select **Master Branch**
- The live link for the website will now appear beneath the **GitHub Pages** header.
- Click the link and a live website will open in a new tab.


### How to run this project locally
If you wish to clone this project from GitHub:

- Click on this [link](https://github.com/Squelsh84/milestone-UFO) to the GitHub repository.
- There is a green button saying "Clone or download" on the right-hand side, click on this.
- Next copy the clone URL for the repository that is provided.
- Open Git Bash in your local IDE.
- Change the current working directory to the location where you want the cloned directory to be created.
- Type ```git clone```, and then paste the URL copied in Step 3.
```console
git clone https://github.com/USERNAME/REPOSITORY
````
- Press Enter to create your local clone.

## Credits

### Content

* UFO data from Kaggle: https://www.kaggle.com/camnugent/ufo-sightings-around-the-world
* Sidebar idea came from: https://bootstrapious.com/p/bootstrap-sidebar

### Media

* Favicon taken from flaticon: https://www.flaticon.com/free-icon/ufo_214358#term=ufo&page=1&position=2.
* Sidebar Image from google.
* Responsiveness and device images image from http://ami.responsivedesign.is/ 

### Acknowledgements

* Chart documentation: https://dc-js.github.io/dc.js/examples/
* Leaflet Map tutorial : https://leafletjs.com/examples.html
* Inspiration from: https://robsimons1.github.io/global-white-shark-attack-dashboard/ - Rob Simons
* Stack Overflow for being a fountain of information.

