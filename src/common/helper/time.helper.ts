import { Injectable } from "@nestjs/common";
var moment = require("moment-timezone");


/**
 * 
 * @author Harshit Kumar <harshit160295@gmail.com>
 */

@Injectable()
export class TimeHelper {
  async convertTimeStampToDate(data) {
    return moment(data * 1000).format("YYYY-MM-DD");
  }

  async convertTimeStampToDateTime(data) {
    return moment(data * 1000).format("DD MMM YYYY - HH:mm");
  }

  async formatTimestamptoString(
    timestamp,
    timezone = "Asia/Kolkata",
    format = "DD MMM YYYY - HH:mm"
  ) {
    if (timezone) {
      return moment(timestamp * 1000)
        .tz(timezone)
        .format(format);
    }
    return moment(timestamp * 1000).format(format);
  }

  async convertDateToDateTime(date, format = "DD MMM YYYY - HH:mm") {
    return moment(date).format(format);
  }
}
