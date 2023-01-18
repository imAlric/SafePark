<?php
class Time{
    protected static function AddMonths($months, DateTime $dateObject) 
    {
        $next = new DateTime($dateObject->format('Y-m-d'));
        $next->modify('last day of +'.$months.' month');

        if($dateObject->format('d') > $next->format('d')) {
            return $dateObject->diff($next);
        } else {
            return new DateInterval('P'.$months.'M');
        }
    }

    public static function Cycle($d1, $months)
    {
        $date = new DateTime($d1);
        $newDate = $date->add(Time::AddMonths($months, $date));
        $dateReturned = $newDate->format('Y-m-d'); 

        return $dateReturned;
    }
}