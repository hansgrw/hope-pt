import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Resource } from '../resources/resource.entity';

const CATEGORIES = [
  {
    slug: 'food',
    name: 'food',
    description:
      'food-desc',
    icon: '🍎',
    color: '#22C55E',
    order: 1,
  },
  {
    slug: 'health',
    name: 'health',
    description:
      'health-desc',
    icon: '🏥',
    color: '#3B82F6',
    order: 2,
  },
  {
    slug: 'housing',
    name: 'housing',
    description:
      'housing-desc',
    icon: '🏠',
    color: '#F59E0B',
    order: 3,
  },
  {
    slug: 'employment',
    name: 'employment',
    description:
      'employment-desc',
    icon: '💼',
    color: '#8B5CF6',
    order: 4,
  },
  {
    slug: 'documentation',
    name: 'documentation',
    description:
      'documentation-desc',
    icon: '📋',
    color: '#6366F1',
    order: 5,
  },
  {
    slug: 'financial-support',
    name: 'financial-support',
    description:
      'financial-support-desc',
    icon: '💰',
    color: '#10B981',
    order: 6,
  },
  {
    slug: 'domestic-violence',
    name: 'domestic-violence',
    description:
      'domestic-violence-desc',
    icon: '🛡️',
    color: '#EF4444',
    order: 7,
  },
  {
    slug: 'education',
    name: 'education',
    description:
      'education-desc',
    icon: '🎓',
    color: '#0EA5E9',
    order: 8,
  },
  {
    slug: 'discrimination',
    name: 'discrimination',
    description:
      'discrimination-desc',
    icon: '🤝',
    color: '#EC4899',
    order: 9,
  },
  {
    slug: 'general-services',
    name: 'general-services',
    description:
      'general-services-desc',
    icon: 'ℹ️',
    color: '#6B7280',
    order: 10,
  },
];

const RESOURCES: Partial<Resource & { categorySlug: string }>[] = [
  // Food & Basic Needs
  {
    categorySlug: 'food',
    title: 'Banco Alimentar Contra a Fome',
    description:
      'Portugal\'s largest food bank network that collects and distributes food to people in need. They work with over 2,400 partner institutions across the country.',
    url: 'https://www.bancoalimentar.pt',
    phone: '+351 21 361 1880',
    organization: 'Banco Alimentar',
    isUrgent: false,
    languages: 'Portuguese',
    eligibility: 'Anyone in food insecurity',
  },
  {
    categorySlug: 'food',
    title: 'Cruz Vermelha Portuguesa – Emergency Aid',
    description:
      'Provides food parcels, clothing, hygiene kits, and first-response emergency supplies to vulnerable families and individuals.',
    url: 'https://www.cruzvermelha.pt',
    phone: '+351 21 771 4000',
    organization: 'Cruz Vermelha Portuguesa',
    isUrgent: true,
    languages: 'Portuguese, English',
  },
  {
    categorySlug: 'food',
    title: 'Refood Network',
    description:
      'Community-driven network that rescues surplus food from restaurants and distributes it to families in need. Over 60 active nuclei across Portugal.',
    url: 'https://www.re-food.org',
    organization: 'Refood',
    isUrgent: false,
    languages: 'Portuguese, English',
  },
  // Health
  {
    categorySlug: 'health',
    title: 'SNS – National Health Service (Migrant Access)',
    description:
      'Immigrants in Portugal have the right to access the National Health Service. ACSS provides guidance on how to register at a local health center (Centro de Saúde).',
    url: 'https://www.sns.gov.pt',
    phone: '808 24 24 24',
    organization: 'Serviço Nacional de Saúde',
    isUrgent: false,
    languages: 'Portuguese, English, French, Spanish',
    eligibility: 'All residents including undocumented migrants for emergency care',
  },
  {
    categorySlug: 'health',
    title: 'Médicos do Mundo Portugal',
    description:
      'Free primary healthcare access for vulnerable people including migrants, homeless individuals, and victims of trafficking.',
    url: 'https://www.medicosdoMundo.pt',
    phone: '+351 21 157 2500',
    organization: 'Médicos do Mundo',
    isUrgent: false,
    languages: 'Portuguese, English, French, Arabic',
    eligibility: 'Vulnerable groups without access to healthcare',
  },
  {
    categorySlug: 'health',
    title: 'Mental Health Support – Comunidade Vida e Paz',
    description:
      'Psychosocial support, counseling, and mental health services for immigrants and refugees dealing with stress, trauma, and adaptation challenges.',
    url: 'https://www.cvp.pt',
    organization: 'Comunidade Vida e Paz',
    phone: '+351 21 842 5100',
    isUrgent: false,
    languages: 'Portuguese, English',
  },
  // Housing
  {
    categorySlug: 'housing',
    title: 'IHRU – Emergency Housing Assistance',
    description:
      'Instituto da Habitação e da Reabilitação Urbana manages social housing programs and emergency accommodation requests in Portugal.',
    url: 'https://www.ihru.pt',
    phone: '+351 21 798 2000',
    organization: 'IHRU',
    isUrgent: false,
    languages: 'Portuguese',
    eligibility: 'Legal residents in housing need',
  },
  {
    categorySlug: 'housing',
    title: 'SOS Racismo – Tenant Rights Helpline',
    description:
      'Support for migrants facing housing discrimination, unlawful eviction, or difficulties in accessing accommodation due to their origin.',
    url: 'https://www.sosracismo.pt',
    phone: '+351 21 357 3411',
    organization: 'SOS Racismo',
    isUrgent: false,
    languages: 'Portuguese, English',
  },
  // Employment
  {
    categorySlug: 'employment',
    title: 'IEFP – Employment and Vocational Training Institute',
    description:
      'Portugal\'s public employment service offering job centers, training programs, and support for job seekers including immigrants.',
    url: 'https://www.iefp.pt',
    phone: '300 010 000',
    organization: 'IEFP',
    isUrgent: false,
    languages: 'Portuguese',
    eligibility: 'Registered job seekers with valid documentation',
  },
  {
    categorySlug: 'employment',
    title: 'NARIC Portugal – Diploma Recognition',
    description:
      'National Academic Recognition Information Centre. Assists foreign graduates in getting their international academic qualifications recognized in Portugal.',
    url: 'https://www.dges.gov.pt/pt/pagina/reconhecimento',
    organization: 'DGES / NARIC Portugal',
    isUrgent: false,
    languages: 'Portuguese, English',
  },
  {
    categorySlug: 'employment',
    title: 'ACM – Immigrant Employment Support Centers (CNAIM)',
    description:
      'National Centers for the Support of the Immigrant Community offer free counseling on employment rights, working contracts, and labor issues.',
    url: 'https://www.acm.gov.pt',
    phone: '808 257 257',
    organization: 'ACM – Alto Comissariado para as Migrações',
    isUrgent: false,
    languages: 'Portuguese, English, French, Creole, Mandarin, Hindi',
  },
  // Documentation
  {
    categorySlug: 'documentation',
    title: 'SEF / AIMA – Immigration & Borders Service',
    description:
      'Now AIMA (Agência para a Integração, Migrações e Asilo). Processes residence permits, visas, renewals, and nationality requests.',
    url: 'https://aima.gov.pt',
    phone: '+351 21 711 5000',
    organization: 'AIMA',
    isUrgent: false,
    languages: 'Portuguese, English',
    schedule: 'By appointment',
  },
  {
    categorySlug: 'documentation',
    title: 'Refugee Support – UNHCR Portugal',
    description:
      'UNHCR supports asylum seekers and refugees in Portugal with legal guidance, documentation, and referrals to national programs.',
    url: 'https://www.unhcr.org/pt/',
    phone: '+351 21 315 5030',
    organization: 'UNHCR',
    isUrgent: true,
    languages: 'Portuguese, English, French, Arabic',
    eligibility: 'Asylum seekers and refugees',
  },
  {
    categorySlug: 'documentation',
    title: 'Conselho Português para os Refugiados (CPR)',
    description:
      'Legal support for asylum seekers and refugees including representation in asylum procedures, appeals, and integration programs.',
    url: 'https://www.cpr.pt',
    phone: '+351 21 358 4635',
    organization: 'CPR',
    isUrgent: false,
    languages: 'Portuguese, English, French, Arabic',
  },
  // Financial
  {
    categorySlug: 'financial-support',
    title: 'Social Security – Rendimento Social de Inserção (RSI)',
    description:
      'Social income program for individuals and families in extreme poverty. Immigrants with legal residence can apply.',
    url: 'https://www.seg-social.pt',
    phone: '300 502 502',
    organization: 'Segurança Social',
    isUrgent: false,
    eligibility: 'Legal residents in financial need',
    languages: 'Portuguese',
  },
  {
    categorySlug: 'financial-support',
    title: 'Cãritas Diocesanas – Emergency Financial Aid',
    description:
      'Emergency financial assistance for basic needs such as rent, utilities, food, and medicine. Available through local parish offices.',
    url: 'https://www.caritas.pt',
    phone: '+351 21 323 1890',
    organization: 'Cáritas Portuguesa',
    isUrgent: true,
    languages: 'Portuguese, English',
  },
  // Domestic Violence
  {
    categorySlug: 'domestic-violence',
    title: 'APAV – Victim Support Line',
    description:
      'Portuguese Association for Victim Support offers free, confidential legal, psychological, and social support to victims of domestic violence.',
    url: 'https://apav.pt',
    phone: '116 006',
    organization: 'APAV',
    isUrgent: true,
    languages: 'Portuguese, English, French, Spanish, Creole',
    schedule: '24/7 emergency line',
  },
  {
    categorySlug: 'domestic-violence',
    title: 'CIG – Domestic Violence Emergency Hotline',
    description:
      'National hotline for domestic violence coordinated by the Commission for Citizenship and Gender Equality. Connects to local resources and shelters.',
    url: 'https://www.cig.gov.pt',
    phone: '800 202 148',
    organization: 'CIG',
    isUrgent: true,
    languages: 'Portuguese',
    schedule: '24/7',
  },
  {
    categorySlug: 'domestic-violence',
    title: 'UMAR – Union of Women Alternative Movement',
    description:
      'Support for women in situations of violence, providing shelters, psychological support, legal counseling, and empowerment programs.',
    url: 'https://www.umarfeminismos.org',
    phone: '+351 21 887 2280',
    organization: 'UMAR',
    isUrgent: false,
    languages: 'Portuguese, English',
  },
  // Education
  {
    categorySlug: 'education',
    title: 'DGE – School Enrollment for Immigrant Children',
    description:
      'Every child in Portugal has the right to education regardless of their documentation status. The Directorate-General of Education provides guidance on enrollment.',
    url: 'https://www.dge.mec.pt',
    phone: '+351 21 393 4500',
    organization: 'Direção-Geral da Educação',
    isUrgent: false,
    languages: 'Portuguese',
    eligibility: 'All children regardless of status',
  },
  {
    categorySlug: 'education',
    title: 'Portuguese Language Courses for Immigrants (PLI)',
    description:
      'Free Portuguese language courses offered through IEFP and ACM for adult immigrants, including intensive and general programs.',
    url: 'https://www.acm.gov.pt/en/web/acm',
    organization: 'ACM / IEFP',
    isUrgent: false,
    languages: 'Portuguese (learning), Multiple instruction languages',
  },
  {
    categorySlug: 'education',
    title: 'Gulbenkian Foundation – Scholarships for Migrants',
    description:
      'The Gulbenkian Foundation offers scholarships and educational programs supporting integration, cultural access, and higher education for migrants.',
    url: 'https://gulbenkian.pt',
    organization: 'Fundação Calouste Gulbenkian',
    isUrgent: false,
    languages: 'Portuguese, English',
  },
  // Discrimination
  {
    categorySlug: 'discrimination',
    title: 'CICDR – Commission for Equality and Against Racial Discrimination',
    description:
      'Official body to report cases of racial or ethnic discrimination in employment, housing, or public services. Files complaints on your behalf.',
    url: 'https://www.acm.gov.pt/pt/cicdr',
    phone: '+351 21 367 2700',
    organization: 'CICDR / ACM',
    isUrgent: false,
    languages: 'Portuguese',
  },
  {
    categorySlug: 'discrimination',
    title: 'SOS Racismo – Anti-Discrimination Support',
    description:
      'Legal support, complaint filing, and advocacy for victims of racism and racial discrimination in Portugal.',
    url: 'https://www.sosracismo.pt',
    phone: '+351 21 357 3411',
    organization: 'SOS Racismo',
    isUrgent: false,
    languages: 'Portuguese, English, Creole',
  },
  {
    categorySlug: 'discrimination',
    title: 'CLAIM – Immigrant Community Integration Center (Lisbon)',
    description:
      'Lisbon-based center offering integration services, intercultural events, legal support, and community activities for immigrants.',
    url: 'https://www.claim.pt',
    phone: '+351 21 361 8490',
    organization: 'CLAIM / Lisbon City Council',
    address: 'Largo do Intendente 13, 1100-285 Lisboa',
    isUrgent: false,
    languages: 'Portuguese, English, French, Creole, Arabic',
  },
  // General
  {
    categorySlug: 'general-services',
    title: 'ACM – National Migrant Support Line',
    description:
      'Free national hotline providing information and support in multiple languages on all aspects of immigrant life in Portugal.',
    url: 'https://www.acm.gov.pt',
    phone: '808 257 257',
    organization: 'ACM – Alto Comissariado para as Migrações',
    isUrgent: false,
    schedule: 'Mon-Fri 9:00-18:00',
    languages: 'Portuguese, English, French, Creole, Mandarin, Spanish, Hindi, Bengali',
  },
  {
    categorySlug: 'general-services',
    title: 'Provedor de Justiça – Ombudsman',
    description:
      'The Ombudsman Office defends the rights of all individuals in Portugal, including immigrants, against administrative violations.',
    url: 'https://www.provedor-jus.pt',
    phone: '+351 21 392 6600',
    organization: 'Provedor de Justiça',
    isUrgent: false,
    languages: 'Portuguese',
  },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Resource)
    private readonly resourceRepo: Repository<Resource>,
  ) { }

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    const count = await this.categoryRepo.count();
    if (count > 0) {
      this.logger.log('Database already seeded, skipping.');
      return;
    }

    this.logger.log('Seeding database...');

    const savedCategories: Record<string, Category> = {};
    for (const cat of CATEGORIES) {
      const saved = await this.categoryRepo.save(this.categoryRepo.create(cat));
      savedCategories[cat.slug] = saved;
    }

    for (const res of RESOURCES) {
      const { categorySlug, ...resData } = res;
      const category = savedCategories[categorySlug!];
      if (category) {
        const resource = this.resourceRepo.create({
          ...resData,
          categoryId: category.id,
        });
        await this.resourceRepo.save(resource);
      }
    }

    this.logger.log(`Seeded ${CATEGORIES.length} categories and ${RESOURCES.length} resources.`);
  }
}
