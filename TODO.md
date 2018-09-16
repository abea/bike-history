- [ ] Finish GET routes
- [ ] Update tests for status check requests.
- [ ] Make sure queried times are converted to UTC for Mongo query.
- [ ] Convert the UTC ISO string timestamps back to EST for API output.
- [ ] Make all API responses more consistent.
  - Error objects in req.errors array with `code` and `message` properties.

## Improvements to go into production
- [ ] Always store time in ETC to avoid time zone switching. Also would reduce the Moment Timezone dependency at least to basic Moment.
- [ ] Consider abandoning the fancy ID structure
  - Now is the only use for daystamp(?)

## Done
- [X] Store the timestamp in each document at the root (first of the day) and in each hour (for each snapshot)
- [X] Store the kiosk ID in each stationDay document at the root
- [X] Get timestamps in EST
- [X] Install heroku scheduler for regular task running https://devcenter.heroku.com/articles/scheduler
