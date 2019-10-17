# SafetyPortal
Safety Portal is a Web APP (created using Angular-NodeJS-REST APIs)


# About the Portal
Safety Portal serves as a platform where employees can register their requests regarding any Unsafe/Critical/Near Miss condition. It keeps a digital track of the request registered by the employees & E-Mails the request notification to the concerned person and helps him to tend to the condition without delay as using safety portal reduces the time taken by employees to go to the safety department to register the request, hence minimizing the time taken for a request to get resolved.
Safety Portal displays all the request (Pending/Completed) assigned to the user logged in. User/Employee can complete the request after resolving it by providing the mandatory details and upload an image (if any).


#Implementation
Safety Portal is created using Angular framework which is developed by Google and on MVC (Model-View-Controller) architecture using Visual Studio 2017. Angular along with TypeScript is used for creating Components/Views (Combination of HTML template, TypeScript for server-side programming and custom CSS for the template), C# for creating Models and Controllers & Bootstrap for CSS to ensure flexibility in device screen size maintains the layout of template. MSSQL server is used for database. Services are created using typescript for sharing data between different components. Models are created for table of the database and to access the database using CRUD (Create, Read, Update and Delete) Operations.
REST APIs are created in controllers using C# to call the functions in model for fetching data from database using CRUD operations. A shared service is created to call the REST APIs from the component and bind the API response data to the component. In components asynchronous functions are made to call the API’s. These functions are called accordingly as the user operates the portal. Form Groups/Controls are used to bind the user input and various node modules are used for various functions (For e.g. excel for Exporting to excel, moment for generating current date-time, toaster for Notifications etc.).
