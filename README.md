
# Robot_GUI_CSU

## Overview
This project provides a graphical user interface (GUI) for controlling a robot, designed to assist with agricultural tasks such as plowing, seeding, and soil monitoring. It utilizes a live camera feed, 2D Lidar, and gps tracking.

## Features
- **Live Camera Feed**: Stream real-time video to monitor robot activities.
- **Interactive Map**: View and navigate routes for the robot.
- **Active GPS Tracking**: Track vechicle's every step on the map.
- **Agricultural Functions**: Control tasks like plowing and seeding directly from the interface. [Coming-Soon]

## Installation

1. **Clone the Repository**  
   Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Lauren194805/Robot_Gui_CSU.git
   ```

2. **Install Dependencies**  
   Navigate to the project directory and install necessary dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the application by running:
   ```bash
   npm start
   ```

2. Open your browser and visit `http://localhost:3000` to interact with the GUI.

## Configuration

Ensure all required API keys for services like maps are properly configured in the `config` file.

## Backend Integration
For full functionality, ensure that your backend services for robot control are correctly set up to communicate with the GUI.
