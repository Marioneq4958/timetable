export interface TimetableTimeSlot {
  name: string;
  beginMinute: number;
  endMinute: number;
}

export interface TimetableDay {
  name: string;
  short: string | null;
  isoNumber: number | null;
}

export interface TimetableWeek {
  name: string;
  short: string;
}

export interface TimetablePeriod {
  name: string;
  short: string;
}

export interface TimetableBuilding {
  id: string;
  name: string;
  short: string;
  color: string;
}

export interface TimetableRoom {
  id: string;
  name: string | null;
  short: string | null;
  fullName: string | null;
  buildingId: string | null;
  color: string | null;
}

export interface TimetableClass {
  id: string;
  name: string | null;
  short: string | null;
  fullName: string | null;
  teacherId: string | null;
  color: string | null;
}

export interface TimetableSubject {
  id: string;
  name: string | null;
  short: string;
  color: string | null;
}

export interface TimetableTeacher {
  id: string;
  name: string | null;
  short: string | null;
  fullName: string | null;
  color: string | null;
}

export interface TimetableCommonGroup {
  id: string;
  short: string;
  classId: string;
  color: string | null;
  subjectId: string | null;
}

export interface TimetableInterclassGroup {
  id: string;
  classIds: string[];
}

export interface TimetableStudent {
  id: string;
  name: string | null;
  short: string;
  classId: string;
  groupIds: string[];
}

export interface TimetableLesson {
  timeSlotIndex: number | null;
  beginMinute: number;
  endMinute: number;
  dayIndex: number;
  weekIndex: number | null;
  periodIndex: number | null;
  subjectId: string | null;
  teacherIds: string[];
  roomIds: string[];
  groupIds: string[];
  classIds: string[];
  seminarGroup: number | null;
  studentIds: string[];
  interclassGroupId: string | null;
  comment: string | null;
}

export interface TimetableVersionData {
  schemaVersion: string;
  common: {
    timeSlots: TimetableTimeSlot[];
    days: TimetableDay[];
    weeks: TimetableWeek[];
    periods: TimetablePeriod[];
    buildings: TimetableBuilding[];
    rooms: TimetableRoom[];
    classes: TimetableClass[];
    subjects: TimetableSubject[];
    teachers: TimetableTeacher[];
    commonGroups: TimetableCommonGroup[];
    interclassGroups: TimetableInterclassGroup[];
    students: TimetableStudent[];
  };
  lessons: TimetableLesson[];
}

export interface PreparedTimetableVersionData {
  common: {
    timeSlots: TimetableTimeSlot[];
    days: TimetableDay[];
    weeks: TimetableWeek[];
    periods: TimetablePeriod[];
    buildings: Map<string, TimetableBuilding>;
    rooms: Map<string, TimetableRoom>;
    classes: Map<string, TimetableClass>;
    subjects: Map<string, TimetableSubject>;
    teachers: Map<string, TimetableTeacher>;
    commonGroups: Map<string, TimetableCommonGroup>;
    interclassGroups: Map<string, TimetableInterclassGroup>;
    students: Map<string, TimetableStudent>;
  };
  lessonsWithTimeSlots: TimetableLesson[][][][][];
  lessonsWithoutTimeSlots: TimetableLesson[][][][];
}

export function prepareTimetableVersionData(
  data: TimetableVersionData,
): PreparedTimetableVersionData {
  const periods = data.common.periods.length ? data.common.periods : [null];
  const weeks = data.common.weeks.length ? data.common.weeks : [null];
  const lessonsWithTimeSlots = periods.map(() =>
    weeks.map(() =>
      data.common.days.map(() => data.common.timeSlots.map(() => [] as TimetableLesson[])),
    ),
  );
  const lessonsWithoutTimeSlots = periods.map(() =>
    weeks.map(() => data.common.days.map(() => [] as TimetableLesson[])),
  );
  data.lessons.forEach((lesson) => {
    const periodIndex = lesson.periodIndex !== null ? lesson.periodIndex : 0;
    const weekIndex = lesson.weekIndex !== null ? lesson.weekIndex : 0;
    if (lesson.timeSlotIndex === null)
      lessonsWithoutTimeSlots[periodIndex][weekIndex][lesson.dayIndex].push(lesson);
    else
      lessonsWithTimeSlots[periodIndex][weekIndex][lesson.dayIndex][lesson.timeSlotIndex].push(
        lesson,
      );
  });

  return {
    common: {
      timeSlots: data.common.timeSlots,
      days: data.common.days,
      weeks: data.common.weeks,
      periods: data.common.periods,
      buildings: new Map(data.common.buildings.map((building) => [building.id, building])),
      rooms: new Map(data.common.rooms.map((room) => [room.id, room])),
      classes: new Map(data.common.classes.map((cls) => [cls.id, cls])),
      subjects: new Map(data.common.subjects.map((subject) => [subject.id, subject])),
      teachers: new Map(data.common.teachers.map((teacher) => [teacher.id, teacher])),
      commonGroups: new Map(data.common.commonGroups.map((group) => [group.id, group])),
      interclassGroups: new Map(data.common.interclassGroups.map((group) => [group.id, group])),
      students: new Map(data.common.students.map((student) => [student.id, student])),
    },
    lessonsWithTimeSlots,
    lessonsWithoutTimeSlots,
  };
}

export type TimetableUnit =
  | (TimetableClass & { type: 'o' })
  | (TimetableTeacher & { type: 'n' })
  | (TimetableRoom & { type: 's' })
  | (TimetableStudent & { type: 'u' });

export type UnitType = 'o' | 'n' | 's' | 'u';
