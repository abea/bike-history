// ## Notes for station controller
//  - Receive data throught a post route
//  - Async series over the stations in the results.
//  - Add the timestamp to each station status.
//  - If there's a document for that station and day, update the StationDay
//    document with the hour's snapshot.
//  - If not, create a document for the station and day, adding empty objects
//    for the other hours in the day and populate the first hour, including the
//    saved timestamp.
