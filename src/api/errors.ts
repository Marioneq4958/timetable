export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export class SchoolNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'SchoolNotFoundError';
  }
}

export class TimetableVersionNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'TimetableVersionNotFoundError';
  }
}
