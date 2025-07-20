"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { fetchFixtures, fetchLeaguesByCountry } from '../../lib/api';
import { useRouter } from 'next/navigation';

const COUNTRIES = [
  { code: 'england', label: 'England' },
  { code: 'spain', label: 'Spain' },
  { code: 'italy', label: 'Italy' },
  { code: 'germany', label: 'Germany' },
  { code: 'france', label: 'France' },
  { code: 'portugal', label: 'Portugal' },
  { code: 'netherlands', label: 'Netherlands' },
  { code: 'belgium', label: 'Belgium' },
  { code: 'brazil', label: 'Brazil' },
  { code: 'argentina', label: 'Argentina' },
  { code: 'usa', label: 'USA' },
  { code: 'mexico', label: 'Mexico' },
  { code: 'turkey', label: 'Turkey' },
  { code: 'russia', label: 'Russia' },
  { code: 'greece', label: 'Greece' },
  { code: 'scotland', label: 'Scotland' },
  { code: 'switzerland', label: 'Switzerland' },
  { code: 'austria', label: 'Austria' },
  { code: 'ukraine', label: 'Ukraine' },
  { code: 'denmark', label: 'Denmark' },
  { code: 'sweden', label: 'Sweden' },
  { code: 'norway', label: 'Norway' },
  { code: 'poland', label: 'Poland' },
  { code: 'czech republic', label: 'Czech Republic' },
  { code: 'croatia', label: 'Croatia' },
  { code: 'serbia', label: 'Serbia' },
  { code: 'romania', label: 'Romania' },
  { code: 'bulgaria', label: 'Bulgaria' },
  { code: 'china', label: 'China' },
  { code: 'japan', label: 'Japan' },
  { code: 'south korea', label: 'South Korea' },
  { code: 'australia', label: 'Australia' },
];
const SEASONS = [2023, 2022, 2021, 2020];

const statusOptions = ['All', 'Live', 'Finished', 'Upcoming'];

function getStatus(fixture: any) {
  if (fixture.status.short === 'FT') return 'Finished';
  if (fixture.status.short === 'NS') return 'Upcoming';
  if (fixture.status.short === 'PST') return 'Postponed';
  if (fixture.status.short === '1H' || fixture.status.short === '2H' || fixture.status.short === 'LIVE') return 'Live';
  return fixture.status.long;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

const Matches: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [season, setSeason] = useState(SEASONS[0]);
  const [team, setTeam] = useState('all');
  const [country, setCountry] = useState(COUNTRIES[0].code);
  const [leagues, setLeagues] = useState<any[]>([]);
  const [league, setLeague] = useState<number | null>(null);
  const [leaguesLoading, setLeaguesLoading] = useState(false);
  const [leaguesError, setLeaguesError] = useState<string | null>(null);

  const router = useRouter();

  // Fetch leagues when country changes
  useEffect(() => {
    setLeaguesLoading(true);
    setLeaguesError(null);
    fetchLeaguesByCountry(country)
      .then(data => {
        const leagueList = (data.response || []).map((l: any) => ({
          id: l.league.id,
          name: l.league.name,
          logo: l.league.logo,
        }));
        setLeagues(leagueList);
        // Default to Premier League if in England, else first league
        if (country === 'england') {
          const premier = leagueList.find((l: any) => l.name.toLowerCase().includes('premier league'));
          setLeague(premier ? premier.id : (leagueList[0]?.id || null));
        } else {
          setLeague(leagueList[0]?.id || null);
        }
        setLeaguesLoading(false);
      })
      .catch(err => {
        setLeaguesError(err.message);
        setLeaguesLoading(false);
      });
  }, [country]);

  // Fetch fixtures when league or season changes
  useEffect(() => {
    if (!league) return;
    setLoading(true);
    setError(null);
    fetchFixtures(league, season)
      .then(data => {
        setMatches(data.response || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [league, season]);

  // Extract unique teams for the dropdown
  const teams = useMemo(() => {
    const teamSet = new Map();
    matches.forEach((m: any) => {
      teamSet.set(m.teams.home.id, { id: m.teams.home.id, name: m.teams.home.name });
      teamSet.set(m.teams.away.id, { id: m.teams.away.id, name: m.teams.away.name });
    });
    return Array.from(teamSet.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [matches]);

  // Filter and group matches
  let filteredMatches = matches;
  if (selectedDate && selectedDate !== '') {
    filteredMatches = filteredMatches.filter((m: any) => m.fixture.date.slice(0, 10) === selectedDate);
  }
  filteredMatches = filteredMatches.filter((m: any) =>
    status === 'All' ? true : getStatus(m.fixture) === status
  );
  if (team !== 'all') {
    filteredMatches = filteredMatches.filter((m: any) =>
      m.teams.home.id === team || m.teams.away.id === team
    );
  }

  const grouped = [
    {
      country: country.charAt(0).toUpperCase() + country.slice(1),
      countryCode: country,
      league: leagues.find(l => l.id === league)?.name || '',
      matches: filteredMatches.map((m: any) => ({
        id: m.fixture.id,
        time: m.fixture.date.slice(11, 16),
        homeTeam: m.teams.home.name,
        homeShield: m.teams.home.logo,
        awayTeam: m.teams.away.name,
        awayShield: m.teams.away.logo,
        homeScore: m.goals.home,
        awayScore: m.goals.away,
        status: getStatus(m.fixture),
        isFavorite: false,
      })),
    },
  ].filter(g => g.matches.length > 0);

  // Date navigation handlers
  const handlePrevDay = () => {
    const prev = new Date(selectedDate || formatDate(new Date()));
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(formatDate(prev));
  };
  const handleNextDay = () => {
    const next = new Date(selectedDate || formatDate(new Date()));
    next.setDate(next.getDate() + 1);
    setSelectedDate(formatDate(next));
  };
  const handleClearDate = () => {
    setSelectedDate('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Matches
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="country-label">Country</InputLabel>
          <Select
            labelId="country-label"
            value={country}
            label="Country"
            onChange={e => setCountry(e.target.value)}
          >
            {COUNTRIES.map(c => (
              <MenuItem key={c.code} value={c.code}>{c.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180, ml: 2 }}>
          <InputLabel id="league-label">League</InputLabel>
          <Select
            labelId="league-label"
            value={league || ''}
            label="League"
            onChange={e => setLeague(Number(e.target.value))}
            disabled={leaguesLoading || leaguesError !== null}
          >
            {leagues.map((l: any) => (
              <MenuItem key={l.id} value={l.id}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {l.logo && <Avatar src={l.logo} alt={l.name} sx={{ width: 24, height: 24 }} />}
                  <span>{l.name}</span>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120, ml: 2 }}>
          <InputLabel id="season-label">Season</InputLabel>
          <Select
            labelId="season-label"
            value={season}
            label="Season"
            onChange={e => setSeason(Number(e.target.value))}
          >
            {SEASONS.map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180, ml: 2 }}>
          <InputLabel id="team-label">Team</InputLabel>
          <Select
            labelId="team-label"
            value={team}
            label="Team"
            onChange={e => setTeam(e.target.value)}
          >
            <MenuItem value="all">All Teams</MenuItem>
            {teams.map((t: any) => (
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={handlePrevDay} disabled={!selectedDate || selectedDate === ''}>Previous Day</Button>
        <TextField
          type="date"
          value={selectedDate || ''}
          onChange={e => setSelectedDate(e.target.value)}
          size="small"
          sx={{ width: 150 }}
        />
        <Button variant="outlined" onClick={handleNextDay} disabled={!selectedDate || selectedDate === ''}>Next Day</Button>
        <Button variant="outlined" color="secondary" onClick={handleClearDate} disabled={!selectedDate || selectedDate === ''}>Clear Date</Button>
      </Stack>
      {leaguesLoading && <Typography>Loading leagues...</Typography>}
      {leaguesError && <Alert severity="error">{leaguesError}</Alert>}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="All" />
        <Tab label="Favorites" />
        <Tab label="Competitions" />
      </Tabs>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Status:</Typography>
        <ToggleButtonGroup
          value={status}
          exclusive
          onChange={(_, v) => v && setStatus(v)}
          size="small"
        >
          {statusOptions.map(opt => (
            <ToggleButton key={opt} value={opt}>{opt}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : grouped.length === 0 ? (
        <Typography>No matches found for the selected filter.</Typography>
      ) : (
        grouped.map(group => (
          <List
            key={group.league}
            subheader={
              <ListSubheader component="div" sx={{ bgcolor: 'background.paper' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SportsSoccerIcon fontSize="small" />
                  <Typography variant="subtitle1">{group.country} - {group.league}</Typography>
                </Stack>
              </ListSubheader>
            }
          >
            {group.matches.map(match => (
              <React.Fragment key={match.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" color={match.isFavorite ? 'warning' : 'default'}>
                      {match.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  }
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    boxShadow: 1,
                    bgcolor: 'background.paper',
                    p: 1.5,
                    cursor: 'pointer',
                  }}
                  onClick={() => router.push(`/match/${match.id}`)}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={2} alignItems="center" width="100%" justifyContent="space-between">
                        <Chip label={match.time} size="small" color={match.status === 'Live' ? 'error' : 'default'} sx={{ minWidth: 60 }} />
                        <Stack direction="row" spacing={1} alignItems="center" width={180} justifyContent="flex-end">
                          <Avatar src={match.homeShield} alt={match.homeTeam} sx={{ width: 32, height: 32, bgcolor: 'grey.100' }} />
                          <Typography sx={{ minWidth: 80, textAlign: 'right' }}>{match.homeTeam}</Typography>
                        </Stack>
                        <Typography fontWeight="bold" sx={{ fontSize: 20, minWidth: 60, textAlign: 'center' }}>
                          {match.homeScore !== undefined && match.homeScore !== null ? match.homeScore : '-'}
                          {' : '}
                          {match.awayScore !== undefined && match.awayScore !== null ? match.awayScore : '-'}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" width={180} justifyContent="flex-start">
                          <Typography sx={{ minWidth: 80, textAlign: 'left' }}>{match.awayTeam}</Typography>
                          <Avatar src={match.awayShield} alt={match.awayTeam} sx={{ width: 32, height: 32, bgcolor: 'grey.100' }} />
                        </Stack>
                        <Chip label={match.status} size="small" color={
                          match.status === 'Live' ? 'error' :
                          match.status === 'Finished' ? 'success' :
                          match.status === 'Upcoming' ? 'info' : 'default'
                        } sx={{ minWidth: 80 }} />
                      </Stack>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" sx={{ ml: 2 }} />
              </React.Fragment>
            ))}
          </List>
        ))
      )}
    </Box>
  );
};

export default Matches; 