

// For now SUPERADMIN will be able to see each and every tab.
export const tabs=[
    {
      title: 'Students',
      expanded: false,
      children: [
        { title: 'All_Students', route: 'students', allowedRoles: ['SUPERADMIN', 'MANAGER', 'PRINCIPAL', 'CONTROLLER', 'TEACHER', 'STUDENT'] },
        { title: 'Register_Students', route: 'register-students', allowedRoles: ['PRINCIPAL', 'CONTROLLER', 'TEACHER'] },
        { title: 'Notice', route: 'showNotice', allowedRoles: ['SUPERADMIN', 'MANAGER', 'PRINCIPAL', 'CONTROLLER', 'TEACHER', 'STUDENT'] },
        {title: 'My Performance', route:"myPerformance", allowedRoles: ['SUPERADMIN', 'STUDENT']}
      
      ]
    },
    {
      title: 'Teachers',
      expanded: false,
      children: [
        { title: 'Teachers', route: 'teachers', allowedRoles: ['SUPERADMIN', 'MANAGER', 'PRINCIPAL', 'CONTROLLER', 'TEACHER', 'STUDENT'] },
        { title: 'Onboard Teachers', route: 'editTeachers', allowedRoles: ['PRINCIPAL', 'CONTROLLER', 'TEACHER'] },
        { title: 'Upload Notice', route: 'addNotice', allowedRoles: ['SUPERADMIN', 'MANAGER', 'PRINCIPAL', 'CONTROLLER', 'TEACHER'] },
        {title: 'Mark Attendence', route:"markAttendance", allowedRoles: ['SUPERADMIN', 'MANAGER', 'PRINCIPAL', 'CONTROLLER', 'TEACHER']}
      
      ]
    },
    {
      title: 'Marks',
      expanded: false,
      children: [
        { title: 'Marks_Management', route: 'editResult', allowedRoles: ['PRINCIPAL', 'CONTROLLER', 'TEACHER'] }
      ]
    },
    {
      title: 'Enquiries',
      expanded: false,
      children: [
        { title: 'Raise_Enquiry', route: 'raiseEnquiry', allowedRoles: ['SUPERADMIN', 'MANAGER', 'PRINCIPAL', 'CONTROLLER', 'TEACHER', 'STUDENT'] },
        { title: 'Respond_To_Enquiries', route: 'responseEnquiry', allowedRoles: ['PRINCIPAL', 'MANAGER', 'CONTROLLER', 'TEACHER'] }
      ]
    },
    {
      title: 'Management',
      expanded: false,
      children: [
        { title: 'Std/Sec/Sub_Manage', route: 'cssmanagement', allowedRoles: ['PRINCIPAL', 'MANAGER'] }
      ]
    },
    {
      title: 'Extras',
      expanded: false,
      children: [
        { title: 'Extras', route: 'extras', allowedRoles: ['SUPERADMIN', 'MANAGER', 'PRINCIPAL', 'CONTROLLER', 'TEACHER', 'STUDENT'] },
        { title: 'I Card', route: 'iCard', allowedRoles: ['SUPERADMIN', 'MANAGER', 'PRINCIPAL', 'CONTROLLER', 'TEACHER', 'STUDENT'] }
      ]
    }
  ]