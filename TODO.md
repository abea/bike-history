## Improvements to go into production
- [ ] Switch to single route for stations and weather (removing `/get` and `/post`)
- [ ] Change all `.then` chains and callbacks to async/await.
- [ ] Add pagination to API response
- [ ] Always store time in ETC to avoid time zone switching. Also would reduce the Moment Timezone dependency at least to basic Moment.
- [ ] Consider abandoning the fancy ID structure
  - Now is the only use for daystamp(?)
- [ ] Make naming more consistent for station-related files and functions.
