import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkInsert('actions', [
      { id: 1, name: 'add', isDeleted: false, createdAt: '2024-10-29 07:59:44', updatedAt: '2024-10-29 07:59:44' },
      { id: 2, name: 'update', isDeleted: false, createdAt: '2024-10-29 08:00:02', updatedAt: '2024-10-29 08:00:02' },
      { id: 3, name: 'delete', isDeleted: false, createdAt: '2024-10-29 08:00:08', updatedAt: '2024-10-29 08:00:08' },
      { id: 4, name: 'view', isDeleted: false, createdAt: '2024-10-29 08:00:11', updatedAt: '2024-10-29 08:00:11' },
    ]);

    await queryInterface.bulkInsert('modules', [
      { id: 1, label: 'Settings', icon: 'ri-settings-2-line', hasChild: true, url: 'settings', order: 100, isDeleted: false, createdAt: '2024-11-05 07:13:02', updatedAt: '2024-11-05 07:13:02' },
    ]);

    await queryInterface.bulkInsert('pages', [
      { id: 1, label: 'Pages', url: '/pages', order: 1, moduleId: 1, isDeleted: false,icon:"ri-pages-line", createdAt: '2024-11-05 07:15:21', updatedAt: '2024-11-05 07:15:21' },
      { id: 3, label: 'Modules', url: '/modules', order: 2, moduleId: 1, isDeleted: false,icon:"ri-pages-line", createdAt: '2024-11-05 07:15:46', updatedAt: '2024-11-05 07:15:46' },
      { id: 4, label: 'Roles', url: '/roles', order: 3, moduleId: 1, isDeleted: false,icon:"ri-pages-line", createdAt: '2024-11-05 07:16:28', updatedAt: '2024-11-05 07:16:28' },
      { id: 5, label: 'Actions', url: '/actions', order: 4, moduleId: 1, isDeleted: false,icon:"ri-pages-line", createdAt: '2024-11-05 07:16:49', updatedAt: '2024-11-05 07:16:49' },
      { id: 6, label: 'Users', url: '/users', order: 5, moduleId: 1, isDeleted: false,icon:"ri-pages-line", createdAt: '2024-11-05 07:17:00', updatedAt: '2024-11-05 07:17:00' },
    ]);
    
    await queryInterface.bulkInsert('rolepage', [
      { id: 11, roleId: 1, pageId: 3, createdAt: '2024-11-14 08:09:42', updatedAt: '2024-11-14 08:09:42' },
      { id: 12, roleId: 1, pageId: 4, createdAt: '2024-11-14 08:09:42', updatedAt: '2024-11-14 08:09:42' },
    ]);
    await queryInterface.bulkInsert('permissions', [
      { id: 26, rolePageId: 11, actionId: 4, createdAt: '2024-11-14 08:09:42', updatedAt: '2024-11-14 08:09:42' },
      { id: 27, rolePageId: 12, actionId: 4, createdAt: '2024-11-14 08:09:42', updatedAt: '2024-11-14 08:09:42' },
      { id: 28, rolePageId: 12, actionId: 1, createdAt: '2024-11-14 08:09:42', updatedAt: '2024-11-14 08:09:42' },
    ]);


    await queryInterface.bulkInsert('roles', [
      { id: 1, name: 'Super Admin', description: 'Super Admin', type: 'ADMIN', isDeleted: false, createdAt: '2024-11-05 09:25:44', updatedAt: '2024-11-05 09:25:44' },
    ]);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Super Admin',
        roleId: 1,
        age: 24,
        email: 'admin@admin.com',
        password: '$2a$10$lcnBd369Lb2f7sItkuG33.nFIB5oozxYVlkMF6XdRHReGkNIVzI2u',
        designation: 'Super Admin',
        isActive: true,
        isDeleted: false,
        createdAt: '2024-11-05 09:31:09',
        updatedAt: '2024-11-14 08:13:14',
        type: 'ADMIN',
      },
    ]);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('users', {});
    await queryInterface.bulkDelete('roles', {});
    await queryInterface.bulkDelete('rolepage', {});
    await queryInterface.bulkDelete('permissions', {});
    await queryInterface.bulkDelete('pages', {});
    await queryInterface.bulkDelete('modules', {});
    await queryInterface.bulkDelete('actions', {});
  },
};
