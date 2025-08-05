import { Modules, Pages, Roles, User, Permissions, Actions } from "..";
import RolePages from '../RolePage';

User.belongsTo(Roles, { foreignKey: 'roleId' })

Pages.belongsTo(Modules, { foreignKey: 'moduleId' })
Modules.hasMany(Pages, { foreignKey: 'moduleId' });

Pages.hasMany(RolePages, { foreignKey: 'pageId' })
RolePages.belongsTo(Pages, { foreignKey: 'pageId' })

Roles.hasMany(RolePages, { foreignKey: 'roleId' })
RolePages.belongsTo(Roles, { foreignKey: 'roleId' })

Roles.hasMany(Pages, { foreignKey: 'pages' })
Pages.hasMany(Roles, { foreignKey: 'pages' })

// Roles.belongsToMany(Pages, { through: RolePages, foreignKey: 'roleId', otherKey: 'pageId' })
Permissions.belongsTo(RolePages, { foreignKey: 'rolePageId' })
Permissions.belongsTo(Actions, { foreignKey: 'actionId' })
RolePages.hasMany(Permissions, { foreignKey: 'rolePageId' })

import Notifications from '../Notifications';
import AuditLogs from '../AuditLogs';

// Notification belongs to AuditLog
Notifications.belongsTo(AuditLogs, { foreignKey: 'auditLogId', as: 'auditLog' })
AuditLogs.belongsTo(User, { foreignKey: 'userId', as: 'user' })

