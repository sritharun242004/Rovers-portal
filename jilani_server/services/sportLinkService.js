const Sport = require('../models/Sport');
const AgeCategory = require('../models/AgeCategory');
const Distance = require('../models/Distance');
const SportSubType = require('../models/SportSubType');

class SportLinkService {
  static async linkSportToData() {
    try {
      // Get all required data
      const ageCategories = await AgeCategory.find().lean();
      const distances = await Distance.find().lean();

      // Create a mapping for easier access
      const ageCategoryMap = {};
      ageCategories.forEach(cat => {
        ageCategoryMap[cat.ageGroup] = cat._id;
      });

      const distanceMap = {};
      distances.forEach(dist => {
        distanceMap[dist.category] = dist._id;
      });

      // Athletics
      await this.updateAthleticsSport(ageCategoryMap, distanceMap);

      // Swimming
      await this.updateSwimmingSport(ageCategoryMap, distanceMap);

      // Taekwondo
      await this.updateTaekwondoSport(ageCategoryMap);

      // Karate
      await this.updateKarateSport(ageCategoryMap);

      // Skating
      await this.updateSkatingSport(ageCategoryMap, distanceMap);

      // Tennis
      await this.updateTennisSport(ageCategoryMap);

      // Badminton
      await this.updateBadmintonSport(ageCategoryMap);
      return { success: true };
    } catch (error) {
      console.error('Error linking sports to data:', error);
      throw new Error(`Failed to link sports: ${error.message}`);
    }
  }

  static async updateAthleticsSport(ageCategoryMap, distanceMap) {
    try {
      const athletics = await Sport.findOne({ name: 'Athletics' });
      if (!athletics) {
        await Sport.create({ name: 'Athletics' });
        return await this.updateAthleticsSport(ageCategoryMap, distanceMap);
      }

      // Link age categories
      const athleticsAgeCategories = [
        'Under 7', 'Under 9', 'Under 11', 'Under 13', 'Under 15', 'Under 17'
      ];

      const ageCategoryIds = athleticsAgeCategories
        .map(cat => ageCategoryMap[cat])
        .filter(id => id); // Remove undefined

      // Link distances
      const athleticsDistances = ['60m', '80m', '100m'];
      const distanceIds = athleticsDistances
        .map(dist => distanceMap[dist])
        .filter(id => id); // Remove undefined

      // Update sport
      athletics.ageCategories = ageCategoryIds;
      athletics.distances = distanceIds;

      await athletics.save();
    } catch (error) {
      throw new Error(`Failed to update Athletics sport: ${error.message}`);
    }
  }

  static async updateSwimmingSport(ageCategoryMap, distanceMap) {
    try {
      const swimming = await Sport.findOne({ name: 'Swimming' });
      if (!swimming) {
        await Sport.create({ name: 'Swimming' });
        return await this.updateSwimmingSport(ageCategoryMap, distanceMap);
      }

      // Link age categories
      const swimmingAgeCategories = [
        'Under 7', 'Under 9', 'Under 12', 'Under 15', 'Under 17'
      ];

      const ageCategoryIds = swimmingAgeCategories
        .map(cat => ageCategoryMap[cat])
        .filter(id => id);

      // Link distances
      const swimmingDistances = ['25m', '50m'];
      const distanceIds = swimmingDistances
        .map(dist => distanceMap[dist])
        .filter(id => id);

      // Update sport
      swimming.ageCategories = ageCategoryIds;
      swimming.distances = distanceIds;

      await swimming.save();
    } catch (error) {
      console.error('Error updating Swimming sport:', error);
      throw new Error(`Failed to update Swimming sport: ${error.message}`);
    }
  }

  static async updateTaekwondoSport(ageCategoryMap) {
    try {
      const taekwondo = await Sport.findOne({ name: 'Taekwondo' });
      if (!taekwondo) {
        await Sport.create({ name: 'Taekwondo' });
        return await this.updateTaekwondoSport(ageCategoryMap);
      }

      // Link age categories
      const taekwondoAgeCategories = [
        'Under 7', 'Under 9', 'Under 12', 'Under 15', 'Under 17'
      ];

      const ageCategoryIds = taekwondoAgeCategories
        .map(cat => ageCategoryMap[cat])
        .filter(id => id);

      // Create or find sport sub type
      let poomsae = await SportSubType.findOne({
        type: 'POOMSAE',
        sport: taekwondo._id
      });

      if (!poomsae) {
        poomsae = await SportSubType.create({
          type: 'POOMSAE',
          sport: taekwondo._id
        });
      }

      // Update sport
      taekwondo.ageCategories = ageCategoryIds;
      taekwondo.sportSubTypes = [poomsae._id];

      await taekwondo.save();
    } catch (error) {
      console.error('Error updating Taekwondo sport:', error);
      throw new Error(`Failed to update Taekwondo sport: ${error.message}`);
    }
  }

  static async updateKarateSport(ageCategoryMap) {
    try {
      const karate = await Sport.findOne({ name: 'Karate' });
      if (!karate) {
        await Sport.create({ name: 'Karate' });
        return await this.updateKarateSport(ageCategoryMap);
      }

      // Link age categories
      const karateAgeCategories = [
        'Under 7', 'Under 9', 'Under 12', 'Under 15', 'Under 17'
      ];

      const ageCategoryIds = karateAgeCategories
        .map(cat => ageCategoryMap[cat])
        .filter(id => id);

      // Create or find sport sub type
      let kata = await SportSubType.findOne({
        type: 'KATA',
        sport: karate._id
      });

      if (!kata) {
        kata = await SportSubType.create({
          type: 'KATA',
          sport: karate._id
        });
      }

      // Update sport
      karate.ageCategories = ageCategoryIds;
      karate.sportSubTypes = [kata._id];

      await karate.save();
    } catch (error) {
      console.error('Error updating Karate sport:', error);
      throw new Error(`Failed to update Karate sport: ${error.message}`);
    }
  }

  static async updateSkatingSport(ageCategoryMap, distanceMap) {
    try {
      const skating = await Sport.findOne({ name: 'Skating' });
      if (!skating) {
        await Sport.create({ name: 'Skating' });
        return await this.updateSkatingSport(ageCategoryMap, distanceMap);
      }

      // Link age categories
      const skatingAgeCategories = [
        'Under 7', 'Under 9', 'Under 12', 'Under 15', 'Under 17'
      ];

      const ageCategoryIds = skatingAgeCategories
        .map(cat => ageCategoryMap[cat])
        .filter(id => id);

      // Link distances
      const skatingDistances = ['200m', '400m'];
      const distanceIds = skatingDistances
        .map(dist => distanceMap[dist])
        .filter(id => id);

      // Create or find sport sub types
      let quad = await SportSubType.findOne({
        type: 'QUAD',
        sport: skating._id
      });

      if (!quad) {
        quad = await SportSubType.create({
          type: 'QUAD',
          sport: skating._id
        });
      }

      let inline = await SportSubType.findOne({
        type: 'INLINE',
        sport: skating._id
      });

      if (!inline) {
        inline = await SportSubType.create({
          type: 'INLINE',
          sport: skating._id
        });
      }

      // Update sport
      skating.ageCategories = ageCategoryIds;
      skating.distances = distanceIds;
      skating.sportSubTypes = [quad._id, inline._id];

      await skating.save();
    } catch (error) {
      console.error('Error updating Skating sport:', error);
      throw new Error(`Failed to update Skating sport: ${error.message}`);
    }
  }

  static async updateTennisSport(ageCategoryMap) {
    try {
      const tennis = await Sport.findOne({ name: 'Tennis' });
      if (!tennis) {
        await Sport.create({ name: 'Tennis' });
        return await this.updateTennisSport(ageCategoryMap);
      }

      // Link age categories
      const tennisAgeCategories = [
        'Under 7', 'Under 9', 'Under 12', 'Under 15', 'Under 17'
      ];

      const ageCategoryIds = tennisAgeCategories
        .map(cat => ageCategoryMap[cat])
        .filter(id => id);

      // Update sport
      tennis.ageCategories = ageCategoryIds;

      await tennis.save();
    } catch (error) {
      console.error('Error updating Tennis sport:', error);
      throw new Error(`Failed to update Tennis sport: ${error.message}`);
    }
  }

  static async updateBadmintonSport(ageCategoryMap) {
    try {
      const badminton = await Sport.findOne({ name: 'Badminton' });
      if (!badminton) {
        await Sport.create({ name: 'Badminton' });
        return await this.updateBadmintonSport(ageCategoryMap);
      }

      // Link age categories
      const badmintonAgeCategories = [
        'Under 7', 'Under 9', 'Under 12', 'Under 15', 'Under 17'
      ];

      const ageCategoryIds = badmintonAgeCategories
        .map(cat => ageCategoryMap[cat])
        .filter(id => id);

      // Update sport
      badminton.ageCategories = ageCategoryIds;

      await badminton.save();
    } catch (error) {
      console.error('Error updating Badminton sport:', error);
      throw new Error(`Failed to update Badminton sport: ${error.message}`);
    }
  }
}

module.exports = SportLinkService;