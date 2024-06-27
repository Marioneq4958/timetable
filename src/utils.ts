import type {
  School,
  TimetableBuilding,
  TimetableClass,
  TimetableCommonGroup,
  TimetableDay,
  TimetableInterclassGroup,
  TimetablePeriod,
  TimetableRoom,
  TimetableStudent,
  TimetableSubject,
  TimetableTeacher,
  TimetableTimeSlot,
  TimetableVersionData,
  TimetableWeek,
} from "@/types";

export function getFullAddress(school: School) {
  let fullAddress = `${school.address_street} ${school.address_building_number}`;
  if (school.address_apartament_number !== "")
    fullAddress += `/${school.address_apartament_number}`;
  fullAddress += `, ${school.address_zip_code} ${school.address_town}`;
  return fullAddress;
}

export function getCommon(version: TimetableVersionData) {
  const timeSlots = new Map<string, TimetableTimeSlot>();
  version.common.timeSlots.forEach((timeSlot) => {
    timeSlots.set(timeSlot.id, timeSlot);
  });
  const days = new Map<string, TimetableDay>();
  version.common.days.forEach((day) => {
    days.set(day.id, day);
  });
  const weeks = new Map<string, TimetableWeek>();
  version.common.weeks.forEach((week) => {
    weeks.set(week.id, week);
  });
  const periods = new Map<string, TimetablePeriod>();
  version.common.periods.forEach((period) => {
    periods.set(period.id, period);
  });
  const buildings = new Map<string, TimetableBuilding>();
  version.common.buildings.forEach((building) => {
    buildings.set(building.id, building);
  });
  const rooms = new Map<string, TimetableRoom>();
  version.common.rooms.forEach((room) => {
    rooms.set(room.id, room);
  });
  const classes = new Map<string, TimetableClass>();
  version.common.classes.forEach((class_) => {
    classes.set(class_.id, class_);
  });
  const subjects = new Map<string, TimetableSubject>();
  version.common.subjects.forEach((subject) => {
    subjects.set(subject.id, subject);
  });
  const teachers = new Map<string, TimetableTeacher>();
  version.common.teachers.forEach((teacher) => {
    teachers.set(teacher.id, teacher);
  });
  const commonGroups = new Map<string, TimetableCommonGroup>();
  version.common.commonGroups.forEach((commonGroup) => {
    commonGroups.set(commonGroup.id, commonGroup);
  });
  const interclassGroups = new Map<string, TimetableInterclassGroup>();
  version.common.interclassGroups.forEach((interclassGroup) => {
    interclassGroups.set(interclassGroup.id, interclassGroup);
  });
  const students = new Map<string, TimetableStudent>();
  version.common.students.forEach((student) => {
    students.set(student.id, student);
  });
  return {
    timeSlots,
    days,
    weeks,
    periods,
    buildings,
    rooms,
    classes,
    subjects,
    teachers,
    commonGroups,
    interclassGroups,
    students,
  };
}

export function getTimeSlotTime(minutes: number) {
  return `${Math.trunc(minutes / 60)}:${(
    `00` + (minutes % 60).toString()
  ).slice(-2)}`;
}
