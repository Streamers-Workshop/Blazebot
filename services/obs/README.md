# OBS Controller Service

## Created by: Bioblaze Payne

### What this is.
This allows for OBS to be used/controlled within Trovobot.


### Settings

```json
{
  "active": false,
  "address": "localhost",
  "port": 4444,
  "retry_count": 5
}
```

change your address if it is on a computer on your local network, set the port and make sure it is open if you are attempting to access this from another computer.
Set your retry count, which means how many times will it attempt to retry to connect to OBS is the connection fails.
