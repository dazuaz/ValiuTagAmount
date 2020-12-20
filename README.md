# React Native Job Application Test App

### Functional requirements

The app must:

1. Connect with backend and sockets
1. Create a native component to input amount and apply mask
1. Create a custom numeric keyboard.
1. Create a amount tag with a amount and assigns a random color, the tag has to be inserted at the beginning of the list
1. Edit the amount tag’s name.
1. Remove the amount tag.
1. Synchronize

the list in real time in all clients. If a client A adds a amount tag “20,000” then client B should update its list in real time to append the new amount tag “20,000” at the beginning of the list, also all changes like the editions and removals of the elements.

For the input of the amounts of money, you must create a native component in java or kotlin (Android) and Swift or Objective-C (iOS), that allows the user to write whole numbers and decimals. This input must apply a mask to the amount entered by the user, using '.' for thousands and ',' for decimals, for example:

- If user writes ‘20000’ the input must show ‘20.000’
- If user writes ‘20,5’ the input must show ‘20,5’
- If user writes ‘1000,25’ the input must show ‘1.000,25’

This input must be fluid and apply the mask in real time, while the user is typing.

On the other hand, when the list scrolls, and begins to slide, the header must be animated and displayed in a reduced format as shown in the images in subsection "UI design".

### **Non-Functional Requirements**

1. Create unit test for app components.
1. High code quality, we’re going to be very strict in this area.
1. Use linter to improve your code style
1. List 1.000 elements without lag in the interface.

### Backend connections location

[https://github.com/macortesn/valiu-tags-backend](https://github.com/macortesn/valiu-tags-backend)

### Enviroment setup

[https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)

`npx pod-insall`

### Run app

`npx react-native run-ios`
