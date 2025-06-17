import { Sequelize } from 'sequelize';

class SequelizeClass {
  private static instance: SequelizeClass | null = null;
  public sequelize!: Sequelize; // Definite Assignment Assertion

  private constructor() {
    if (!SequelizeClass.instance) {
      console.log("creating db instance...");
      const dbUrl = process?.env?.DB_URL;
      if (!dbUrl) {
        throw new Error('DB_URL environment variable is not defined.');
      }
      this.sequelize = new Sequelize(dbUrl, {
        logging: false
      });
      SequelizeClass.instance = this;
      this.syncModels();
      // console.log("db instance created..")
    }
    return SequelizeClass.instance;
  }

  public static getInstance(): SequelizeClass {
    if (!SequelizeClass.instance) {
      SequelizeClass.instance = new SequelizeClass();
    }
    return SequelizeClass.instance!;
  }

  public close(): Promise<void> {
    return this.sequelize.close();
  }

  private syncModels(): void {
    this.sequelize.sync({ alter: true })
    // this.sequelize.sync({})
      .then(res => console.log("Database synchronized successfully!"))
      .catch(err => console.log("Error synchronizing database.", err.message));
  }
}

export default SequelizeClass;
