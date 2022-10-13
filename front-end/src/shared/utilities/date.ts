import { format } from 'date-fns';

const formatDateNumber = (date: number, template: string = 'MM/dd HH:mm') => {
  return formatDate(new Date(date), template);
};

const formatDate = (date: Date, template: string = 'MM/dd HH:mm') => {
  if (template === '') template = 'MM/dd HH:mm';
  return format(date, template);
};

export { formatDateNumber, formatDate };
