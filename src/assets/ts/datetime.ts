export default class Now{
    Date():any{
        let today:any = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1;
        let yyyy = today.getFullYear();
        if(dd < 10) dd = '0' + dd;
        if(mm < 10) mm = '0' + mm;
        return today = yyyy + '-' + mm + '-' + dd;
    }

    Time():any{
        let today:any = new Date();
        return ((today.getHours() < 10)? "0" : "") + today.getHours() + ":" + ((today.getMinutes() < 10)?"0":"") + today.getMinutes();
    }

    isValidDate(d:any):any{
        if (Object.prototype.toString.call(d) === "[object Date]") {
            if (isNaN(d)) {
                return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
    };

    DiffMins(Current:any, DateFormat:any):any{
        var diffMs = Math.abs(Current - DateFormat);

        var diffMins = Math.floor(((diffMs/1000)/60));

        return diffMins;
    }

    DiffHours(Current:any, DateFormat:any):any{
        var diffMs = Math.abs(Current - DateFormat);

        var diffHours = Math.floor((((diffMs/1000)/60)/60));

        return diffHours;
    }

    DiffDays(Current:any, DateFormat:any):any{
        var diffMs = Math.abs(Current - DateFormat);

        var diffDays = Math.floor(((((diffMs/1000)/60)/60)/24));

        return diffDays;
    }

    FormatDateUTC(PropDate:any):any{
        let FormatDate:any = new Date(PropDate);
        let dd = FormatDate.getDate()+1;
        let mm = FormatDate.getMonth()+1;
        let yyyy = FormatDate.getFullYear();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return FormatDate = yyyy + '-' + mm + '-' + dd;
    }

    FormatDateGMT(PropDate:any){
        let FormatDate:any = new Date(PropDate);
        let dd = FormatDate.getDate();
        let mm = FormatDate.getMonth()+1;
        let yyyy = FormatDate.getFullYear();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return FormatDate = dd + '/' + mm + '/' + yyyy;
    }

    FormatDateTimeGMT(PropDate:any){
        let FormatDate:any = new Date(PropDate);
        let dd = FormatDate.getDate();
        let mm = FormatDate.getMonth()+1;
        let yyyy = FormatDate.getFullYear();
        let time = ((FormatDate.getHours() < 10)? "0" : "") + FormatDate.getHours() + ":" + ((FormatDate.getMinutes() < 10)?"0":"") + FormatDate.getMinutes();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return FormatDate = dd + '/' + mm + '/' + yyyy + ' ' + time;
    }
}