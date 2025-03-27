import React, { useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import AgendaItem from '../../../components/calander/AgendaItem';
import { agendaItems, getMarkedDates } from '../../../components/calander/mockItems';
import { AppColor } from '../../../constants/theme';

const ITEMS: any[] = agendaItems;

interface Props {
  weekView?: boolean;
}

const ExpandableCalendarScreen = (props: Props) => {
  const { weekView } = props;
  const marked = useRef(getMarkedDates());
  const todayBtnTheme = useRef({
    todayButtonTextColor: AppColor.primary,
  });

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  return (
    <CalendarProvider
      date={ITEMS[1]?.title}
      showTodayButton
      theme={todayBtnTheme.current}
    >
      {weekView ? (
        <WeekCalendar
          firstDay={1}
          markedDates={marked.current}
          style={styles.weekCalendar}
        />
      ) : (
        <ExpandableCalendar
          firstDay={1}
          markedDates={marked.current}
          theme={{
            backgroundColor: AppColor.light,
            calendarBackground: AppColor.light,
            textSectionTitleColor: AppColor.primary,
            selectedDayBackgroundColor: AppColor.primary,
            selectedDayTextColor: AppColor.light,
            todayBackgroundColor: AppColor.secondary,
            todayTextColor: AppColor.light,
            dayTextColor: AppColor.dark90,
            textDisabledColor: AppColor.light20,
            dotColor: AppColor.primary,
            selectedDotColor: AppColor.light,
            arrowColor: AppColor.primary,
            monthTextColor: AppColor.dark90,
            indicatorColor: AppColor.primary,
          }}
        />
      )}
      <AgendaList
        sections={ITEMS}
        renderItem={renderItem}
        sectionStyle={styles.section}
      />
    </CalendarProvider>
  );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  weekCalendar: {
    backgroundColor: AppColor.light,
  },
  section: {
    backgroundColor: AppColor.secondary,
    color: AppColor.light,
    paddingTop: 11,
    paddingBottom: 11,
    marginBottom: 4,
  },
});
