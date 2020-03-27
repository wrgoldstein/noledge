# Noledge

A jupyter notebook publishing platform. The goals are to encourage:

- Analysts to be aware of what other analysts are working on
- Uniform style in ad hoc analysis

And to discourage:
- The knowledge drain that can come from analysis dissapearing into google slides or emails
- Onerous additional effort to turn analysis into presentation
- A lack of connection between the analytical work and what is presented to stakeholders.

## Usage

Once deployed, authors may contribute jupyter notebooks to the configured repository. They will appear in the feed as beautiful html posts with hideable code.

Note we will eventually add a github webhook, but currently you must manually pull the latest work by navigating to the "User Settings" page.

## Frontmatter

To add a title, description, or tags to your post, we use frontmatter. In the first cell, **set to raw mode** use three dashes, followed by valid yaml, followed by three more dashes:

```
---
title: Use this instead of the filename as the title
author: It's actually by this person, not the last committer
description: The poets are strangely silent on the subject of cheese
tags:
- cheese
- poets
---
```

## Cell parameters

At the top of a notebook cell, in a comment, you can add one of the following cell level options:

- echo: Include the stdout of the cell even when code is hidden.
- wide: Allow images from this cell to be extra wide.

```python
# wide, echo

import matplotlib.pyplot as plt
...
```

## Latex quirks

We're using the [https://katex.org/](https://katex.org/) library to typeset math, which is different from the mathjax library used by Jupyter. Unfortunately, this means there are some syntax differences:

- Use `\begin{aligned}` instead of `\begin{align}`

## Developing

1. Clone this repository
2. Add the following variables to your environment

``` sh
export REPO="https://github.com/user/notebooks.git"
export REPO="../notebooks"  # local alternative
export JWT_SECRET=fruityloops
export DEPLOY_SECRET=...
export GOOGLE_CLIENT_ID=...
```

Where the `DEPLOY_SECRET` are generated as directed [here](https://developer.github.com/v3/guides/managing-deploy-keys/#deploy-keys) and the `GOOGLE_CLIENT_ID` from [here](https://developers.google.com/identity/protocols/oauth2). The `JWT_SECRET` can be any (secret) string.
