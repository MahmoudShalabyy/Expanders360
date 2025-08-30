import { AppDataSource } from '../data-source';

async function seed() {
  await AppDataSource.initialize();

  const clientRepository = AppDataSource.getRepository('Client');
  const projectRepository = AppDataSource.getRepository('Project');
  const vendorRepository = AppDataSource.getRepository('Vendor');

  // Seed Clients
  await clientRepository.save([
    { company_name: 'Tech Corp', contact_email: 'tech@corp.com' },
    { company_name: 'Innovate Inc', contact_email: 'innovate@inc.com' },
  ]);

  // Seed Projects
  await projectRepository.save([
    {
      client: { id: 1 },
      country: 'Egypt',
      services_needed: ['web_development', 'consulting'],
      budget: 10000,
      status: 'active',
    },
    {
      client: { id: 2 },
      country: 'UAE',
      services_needed: ['mobile_development', 'marketing'],
      budget: 15000,
      status: 'active',
    },
  ]);

  // Seed Vendors
  await vendorRepository.save([
    {
      name: 'Vendor A',
      countries_supported: ['Egypt', 'UAE'],
      services_offered: ['web_development', 'consulting'],
      rating: 4.5,
      response_sla_hours: 24,
    },
    {
      name: 'Vendor B',
      countries_supported: ['UAE', 'KSA'],
      services_offered: ['mobile_development', 'marketing'],
      rating: 4.0,
      response_sla_hours: 48,
    },
  ]);

  console.log('Seeding completed!');
  await AppDataSource.destroy();
}

seed().catch((error) => console.error('Seeding failed:', error));
