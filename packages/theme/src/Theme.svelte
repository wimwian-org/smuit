<!--
  @wimwian-org/theme
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Theme entry component. Imports the batteries-included theme CSS (Google Fonts +
  Tailwind + the flat token theme) and renders the font preconnect hints — which
  CSS can't express — into <svelte:head>, so they land in the initial document
  head (SSR). Mount once near your app root:

      <script>import Theme from '@wimwian-org/theme/svelte';</script>
      <Theme />
-->
<script lang="ts">
    import './theme.css';
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</svelte:head>
