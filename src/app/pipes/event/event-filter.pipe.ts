import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'eventFilter'
})
export class EventFilterPipe implements PipeTransform {

    transform(events: any[], filter: any): any {
        if (!events || !filter) {
            return events;
        }
        if (filter.length == 0) {
            return events;
        }
        let result = [];
        events.forEach(item => {
            if (filter.includes(item.type.name)) {
                result.push(item)
            }
        })
        return result;
    }

}
