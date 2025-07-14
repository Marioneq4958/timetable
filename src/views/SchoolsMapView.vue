<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import L from 'leaflet';
import 'leaflet.markercluster';
import { onMounted, ref, watch } from 'vue';
import ClusterMarkerRepository from '@/repositories/clusterMarker.repository';
import TileRepository from '@/repositories/tile.repository';
import { getSchoolFullAddress } from '@/utils';
import { mapSchoolDTOToEntity } from '@/db/mappers/school.mapper';
import type { SchoolEntity } from '@/db/entities/school.entity';
import { useMediaQuery } from '@vueuse/core';
import SchoolsMapSchoolDialog from '@/components/SchoolsMapSchoolDialog.vue';
import SchoolsMapSchoolSection from '@/components/SchoolsMapSchoolSection.vue';
import schoolRepository from '@/repositories/school.repository';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { LucideArrowLeft } from 'lucide-vue-next';

const props = defineProps<{ schoolId?: number }>();

const mapContainer = ref<HTMLDivElement>();
const loadedTiles = new Set();
const leafletMap = ref<L.Map | null>(null);

const selectedSchool = ref<SchoolEntity | null>(null);

const tilesInfo = {
  minLongTile: 14.0745211117,
  minLatTile: 49.0273953314,
  maxLongTile: 24.0299857927,
  maxLatTile: 54.8515359564,
};

const mapOptions: L.MapOptions = {
  minZoom: 6,
  maxZoom: 18,
  zoomControl: false,
  maxBounds: new L.LatLngBounds(
    new L.LatLng(tilesInfo.minLatTile - 3, tilesInfo.minLongTile - 8),
    new L.LatLng(tilesInfo.maxLatTile + 3, tilesInfo.maxLongTile + 8),
  ),
};

const useDialog = useMediaQuery('(width < 1024px)');
const router = useRouter();

const getClusterClass = (count: number) => {
  if (count < 10) return 'marker-cluster-small';
  if (count < 100) return 'marker-cluster-medium';
  return 'marker-cluster-large';
};

onMounted(async () => {
  leafletMap.value = await setupMap();
});

const createClusterIcon = (count: number) =>
  new L.DivIcon({
    html: `<div><span>${count}</span></div>`,
    className: `marker-cluster ${getClusterClass(count)}`,
    iconSize: new L.Point(40, 40),
  });

const createSchoolMarker = (school: SchoolEntity, map: L.Map) =>
  L.marker([school.geoLat, school.geoLong])
    .bindTooltip(
      `<div class="max-w-96 w-max whitespace-normal font-sans">
        <div class="font-semibold"> [${school.rspoId}] ${school.name} </div>
        <div class="text-muted-foreground"> ${getSchoolFullAddress(school)} </div>
      </div>`,
    )
    .on('click', () => {
      selectedSchool.value = school;
      map.setView(new L.LatLng(school.geoLat, school.geoLong));
    });

async function setupMap() {
  if (!mapContainer.value) throw new Error('No map container.');
  const map = L.map(mapContainer.value, mapOptions).setView([52, 19.5], 6);

  const schoolsMarkerClusterGroup = L.markerClusterGroup().addTo(map);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  })
    .addTo(map)
    .on('tileload', async (e) => {
      if (map.getZoom() <= 8) return;

      const tileLatLng = tileToLatLng(e.coords.x, e.coords.y, e.coords.z);
      if (
        tileLatLng.lat > tilesInfo.maxLatTile ||
        tileLatLng.lat < tilesInfo.minLatTile ||
        tileLatLng.lng > tilesInfo.maxLongTile ||
        tileLatLng.lng < tilesInfo.minLongTile
      )
        return;

      const tileLat = Math.floor(tileLatLng.lat / 0.5);
      const tileLong = Math.floor(tileLatLng.lng / 0.5);
      const tileKey = `${tileLat}:${tileLong}`;

      if (loadedTiles.has(tileKey)) return;
      loadedTiles.add(tileKey);

      const tileSchools = await TileRepository.getTile05ByLatLong(tileLat, tileLong);
      schoolsMarkerClusterGroup.addLayers(
        tileSchools.map((school) => {
          const entity = mapSchoolDTOToEntity(school);
          return createSchoolMarker(entity, map);
        }),
      );
    });

  const communeMarkerClusterGroup = L.markerClusterGroup({
    iconCreateFunction: (cluster) =>
      createClusterIcon(
        cluster
          .getAllChildMarkers()
          .map((marker) => Number(marker.options.title))
          .reduce((a, b) => a + b),
      ),
  }).addTo(map);

  const communeMarkers = await ClusterMarkerRepository.getClusterMarkersForCommunes();
  communeMarkerClusterGroup.addLayers(
    communeMarkers.map((marker) =>
      L.marker([marker.geo_lat, marker.geo_long], {
        title: marker.count.toString(),
        icon: createClusterIcon(marker.count),
      }).on('click', (e) => {
        map.setView(new L.LatLng(e.latlng.lat, e.latlng.lng), 10);
      }),
    ),
  );

  map.on('zoom', () => {
    if (map.getZoom() >= 10) {
      communeMarkerClusterGroup.removeFrom(map);
      schoolsMarkerClusterGroup.addTo(map);
    } else {
      communeMarkerClusterGroup.addTo(map);
      schoolsMarkerClusterGroup.removeFrom(map);
    }
  });

  watch(
    () => props.schoolId,
    async (schoolId) => {
      if (schoolId && schoolId !== selectedSchool.value?.rspoId) {
        // Is saving these schools in indexeddb OK? I don't know.
        const school = await schoolRepository.getSchoolById(schoolId);
        if (schoolId === props.schoolId) {
          selectedSchool.value = school;
          map.setView(new L.LatLng(school.geoLat, school.geoLong));
          if (map.getZoom() < 8) map.setZoom(10);
        }
      }
    },
    { immediate: true },
  );

  return map;
}

function tileToLatLng(x: number, y: number, z: number) {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  const lng = (x / Math.pow(2, z)) * 360 - 180;
  return { lat, lng };
}

function closeSelectedSchool() {
  selectedSchool.value = null;
}

watch(
  () => selectedSchool.value,
  async () => {
    await router.push({ name: 'schools-map', params: { schoolId: selectedSchool.value?.rspoId } });
  },
);
</script>

<template>
  <div
    class="absolute top-5 left-5 bottom-5 flex flex-col overflow-auto md:w-96 w-[calc(100vw-2.5rem)]"
  >
    <div class="bg-background z-[1000] w-min rounded-md">
      <Button variant="ghost" size="icon" as-child>
        <RouterLink :to="{ name: 'home' }">
          <LucideArrowLeft />
        </RouterLink>
      </Button>
    </div>
    <section class="bg-background rounded-md p-5 shadow-sm z-[1000] mt-3">
      <h1 class="font-semibold tracking-tight text-lg">Dodaj szkołę</h1>
      <p class="text-muted-foreground text-sm">
        Znajdź na mapie szkołę, którą chcesz dodać. Kliknij na nią, aby zobaczyć więcej informacji.
      </p>
    </section>
    <SchoolsMapSchoolSection
      v-if="!useDialog && selectedSchool"
      :school="selectedSchool"
      @close="closeSelectedSchool()"
    />
  </div>
  <SchoolsMapSchoolDialog
    :school="selectedSchool"
    v-if="useDialog"
    @close="closeSelectedSchool()"
  />
  <div class="w-screen min-h-dvh" ref="mapContainer" />
</template>
