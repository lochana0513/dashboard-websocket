import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalesHistory } from '../schemas/dashboard-sales.schema';
import { GetSalesChartDto, GetSalesTotalDto } from '../dto';

@Injectable()
export class DashboardSalesService implements OnModuleInit {
  private readonly logger = new Logger(DashboardSalesService.name);

  constructor(
    @InjectModel(SalesHistory.name)
    private salesModel: Model<SalesHistory>,
  ) {}

  private currentMonthIndex = 0;
  private currentYear: number;
  private addMonthInterval: NodeJS.Timer;

  // ===== OnModuleInit: Seed dummy data and start adding months =====
  async onModuleInit() {
    const count = await this.salesModel.countDocuments();
    if (count === 0) {
      console.log('No sales data found. Seeding 2 years of dummy data...');
      await this.seedDummyData();
      console.log('Dummy data seeded.');
    } else {
      console.log('Sales data exists. Initializing current month...');

      // Find the latest month in DB
      const latest = await this.salesModel.findOne().sort({ date: -1 });
      if (latest) {
        this.currentYear = latest.date.getUTCFullYear();
        this.currentMonthIndex = latest.date.getUTCMonth();
      } else {
        this.currentYear = new Date().getUTCFullYear();
        this.currentMonthIndex = new Date().getUTCMonth();
      }
    }

    // Start adding new month every 2 seconds
    this.addMonthInterval = setInterval(() => this.addNewMonth(), 2000);
  }
  // ===== Seed 2 years of monthly data =====
  private async seedDummyData() {
    const now = new Date();
    const startYear = now.getFullYear() - 2;
    const endYear = now.getFullYear();
    const products = ['AcmeProfessional', 'AcmeAdvanced', 'AcmePlus'];

    for (let y = startYear; y <= endYear; y++) {
      for (let month = 0; month < 12; month++) {
        for (const productType of products) {
          const value = Math.floor(Math.random() * 1000) + 100;
          const date = new Date(Date.UTC(y, month, 1));
          await this.salesModel.create({ productType, value, date });
        }
      }
    }

    // Initialize current month to the latest dummy month
    this.currentYear = endYear;
    this.currentMonthIndex = 11; // December
  }

  // ===== Add new month for all products =====
  private async addNewMonth() {
    if (this.currentYear === undefined || this.currentMonthIndex === undefined) {
      this.logger.warn('Skipping addNewMonth: currentYear or currentMonthIndex not initialized');
      return;
    }

    const products = ['AcmeProfessional', 'AcmeAdvanced', 'AcmePlus'];

    for (const productType of products) {
      let nextMonth = this.currentMonthIndex + 1;
      let nextYear = this.currentYear;
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
      }

      const date = new Date(Date.UTC(nextYear, nextMonth, 1));
      const value = Math.floor(Math.random() * 1000) + 100;

      await this.salesModel.create({ productType, value, date });
      this.logger.log(
        `Added new month ${date.toDateString()} for ${productType} with value ${value}`,
      );
    }

    // Move to next month
    this.currentMonthIndex++;
    if (this.currentMonthIndex > 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    }
  }

  // ===== Get last 24 months of monthly sales =====
  async getMonthlySales(dto: GetSalesChartDto) {
    const { productType } = dto;

    // Fetch all data for this product sorted by date
    const data = await this.salesModel.find({ productType }).sort({ date: 1 }).lean();

    // Take last 24 months
    const last24 = data.slice(-24);

    // Split into two sets of 12 months each
    const lastYear = last24.slice(0, 12).map((d) => d.value); // older 12 months
    const thisYear = last24.slice(-12).map((d) => d.value); // latest 12 months

    // Labels: only 12 for comparison
    const labels = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);

    return { labels, thisYear, lastYear };
  }

  async getTotalSales(dto: GetSalesTotalDto) {
    const { productType } = dto;

    const data = await this.salesModel.find({ productType }).sort({ date: 1 }).lean();

    const last12 = data.slice(-12); // take last 12 months
    const total = last12.reduce((acc, d) => acc + d.value, 0);

    return { total };
  }
}
